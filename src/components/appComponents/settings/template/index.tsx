import BP from "./BP";

export default function Template() {
  return (
    <>
      <div className="w-[100%] h-screen flex items-center justify-center gap-5">
        <BP Type="col" />
        <BP Type="row" />
      </div>
    </>
  );
}
