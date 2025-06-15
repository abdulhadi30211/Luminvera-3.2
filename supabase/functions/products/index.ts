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
    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname.replace('/functions/v1/products', '');

    // Handle different routes
    if (method === 'GET' && path === '') {
      // Get all products
      const searchParams = url.searchParams;
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const limit = parseInt(searchParams.get('limit') || '20');
      const offset = parseInt(searchParams.get('offset') || '0');

      // This would typically query your database
      // For now, returning a mock response
      const products = {
        data: [],
        total: 0,
        limit,
        offset
      };

      return new Response(
        JSON.stringify(products),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    if (method === 'GET' && path.startsWith('/')) {
      // Get single product by ID or slug
      const productId = path.substring(1);
      
      // This would typically query your database for a specific product
      const product = {
        id: productId,
        message: `Product ${productId} details would be returned here`
      };

      return new Response(
        JSON.stringify(product),
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