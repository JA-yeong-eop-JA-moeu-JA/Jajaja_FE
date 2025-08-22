interface ISortMenuProps {
  selected: string;
  onSelect: (value?: string) => void;
}

const SORT_OPTIONS = ['신상품순', '인기순', '낮은 가격 순', '리뷰 많은 순'];

export default function Menu({ selected, onSelect }: ISortMenuProps) {
  return (
    <div className="absolute z-10 top-full right-0 w-30 rounded-lg bg-white overflow-hidden shadow-[0px_4px_10px_#00000040]">
      {SORT_OPTIONS.map((option, idx) => (
        <div
          key={option}
          onClick={() => onSelect(option)}
          className={`
            py-3 pl-4 cursor-pointer text-body-regular
            ${selected === option ? 'text-orange' : 'text-black'}
            ${idx !== SORT_OPTIONS.length - 1 && 'border-b border-gray-200'}`}
        >
          {option}
        </div>
      ))}
    </div>
  );
}
