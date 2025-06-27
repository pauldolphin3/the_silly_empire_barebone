import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ url: string }> }
) {
  const { url } = await params;
  const response = await fetch(url);

  const buffer = await response.arrayBuffer();

  const headers = new Headers();
  if (response.headers.get("Content-Type"))
    headers.append("Content-Type", response.headers.get("Content-Type")!);
  if (response.headers.get("Content-Length"))
    headers.append("Content-Length", buffer.byteLength.toString());
  if (response.headers.get("Cache-Control"))
    headers.append("Cache-Control", response.headers.get("Cache-Control")!);
  if (response.headers.get("Last-Modified"))
    headers.append("Last-Modified", response.headers.get("Last-Modified")!);
  if (response.headers.get("ETag"))
    headers.append("ETag", response.headers.get("ETag")!);

  console.log("processed", url);
  return new NextResponse(buffer, {
    status: response.status,
    headers: headers,
  });
}
