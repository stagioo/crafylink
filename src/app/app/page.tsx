import GetURL from "@/components/appComponents/settings/getURL/index";
import Template from "@/components/appComponents/settings/template";
function ProgressBar() {
  return (
    <div className="w-full  p-4">
      <div className="w-full bg-green-100  rounded-full h-2.5">
        <div
          className="bg-green-400 h-2.5 rounded-full"
          style={{ width: "0%" }}
        ></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ProgressBar />
      <div>
        <Template />
      </div>
    </>
  );
}
