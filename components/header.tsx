import { SearchIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="bg-white px-4 pb-2.5 pt-2.5">
      <div className="flex items-center gap-2.5">
        <div className="shrink-0 text-[21px] font-black tracking-[-0.03em] text-wadeal-red">
          Wadeal
        </div>
        <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-gray-100 px-3 text-gray-500">
          <SearchIcon className="h-4 w-4 shrink-0" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[13px] text-wadeal-ink outline-none placeholder:text-gray-400"
            placeholder="공동구매 검색"
            type="search"
          />
        </label>
      </div>
    </header>
  );
}
