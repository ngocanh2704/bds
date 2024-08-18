export async function POST(request) {
  const res = await request.json();
  const token = res.accessToken;
  const user = res.user
  if (!token) {
    return Response.json(
      { message: "Không có token" },
      {
        status: 400,
      }
    );
  }
  return Response.json(res, {
    status: 200,
    headers: { "Set-Cookie": `token=${res.accessToken}` },
  });
}
