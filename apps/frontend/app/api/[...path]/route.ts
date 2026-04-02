import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleApiProxy(request, resolvedParams);
}

async function handleApiProxy(
  request: NextRequest,
  params: { path: string[] }
) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const path = params.path.join('/');
  const url = `${backendUrl}/api/${path}`;
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams.toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  try {
    const headers: Record<string, string> = {};
    
    // Copy relevant headers
    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers.authorization = authorization;
    }
    
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['content-type'] = contentType;
    }

    // Handle request body for POST/PUT
    let body: BodyInit | undefined;
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      body = await request.text();
    }

    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      body,
    });

    // Create response with proper headers
    const responseBody = await response.text();
    
    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}