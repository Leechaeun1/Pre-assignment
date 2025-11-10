// 메인페이지(게시판 목록)

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Pretendard Bold (700)</h1>
      <p className="text-lg font-semibold">Pretendard SemiBold (600)</p>
      <p className="text-lg font-medium">Pretendard Medium (500)</p>
      <p className="text-lg font-normal">Pretendard Regular (400)</p>
      <p className="text-lg font-light">Pretendard Light (300)</p>
    </main>
  );
}
