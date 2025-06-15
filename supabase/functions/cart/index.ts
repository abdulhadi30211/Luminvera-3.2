import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get user from auth token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname.replace('/functions/v1/cart', '');

    if (method === 'GET' && path === '') {
      // Get user's cart items
      const { data: cartItems, error } = await supabaseClient
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            in_stock,
            stock_quantity
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ data: cartItems }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (method === 'POST' && path === '') {
      // Add item to cart
      const { product_id, quantity = 1 } = await req.json();

      if (!product_id) {
        return new Response(
          JSON.stringify({ error: 'Product ID is required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Check if item already exists
      const { data: existingItem } = await supabaseClient
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product_id)
        .single();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabaseClient
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ data }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      } else {
        // Insert new item
        const { data, error } = await supabaseClient
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id,
            quantity,
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ data }),
          {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    if (method === 'PUT' && path.startsWith('/')) {
      // Update cart item
      const itemId = path.substring(1);
      const { quantity } = await req.json();

      if (quantity <= 0) {
        // Delete item if quantity is 0 or less
        const { error } = await supabaseClient
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;

        return new Response(
          JSON.stringify({ message: 'Item removed from cart' }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (method === 'DELETE' && path.startsWith('/')) {
      // Remove item from cart
      const itemId = path.substring(1);

      const { error } = await supabaseClient
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: 'Item removed from cart' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (method === 'DELETE' && path === '') {
      // Clear entire cart
      const { error } = await supabaseClient
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: 'Cart cleared' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});