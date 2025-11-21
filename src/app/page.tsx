import { GetStartedButton } from "@/components/get-started-button";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[calc(100dvh-16rem)]">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1 className="h1 text-6xl font-bold">Better Auth Demo</h1>
        <GetStartedButton />
      </div>
    </div>
  );
}
