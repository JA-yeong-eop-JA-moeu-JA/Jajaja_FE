import { Button } from './button';

export type TTabId = 'basic' | 'industry' | 'writeReview' | 'myReview' | 'review' | 'team';

export const TAB_LABELS: Record<TTabId, string> = {
  basic: '기본',
  industry: '업종별',
  writeReview: '리뷰 쓰기',
  myReview: '작성한 리뷰',
  review: '리뷰',
  team: '팀 모집',
};

export interface IPageButtonProps {
  items: [TTabId, TTabId];
  selected: TTabId;
  onSelect: (id: TTabId) => void;
}

export function PageButton({ items, selected, onSelect }: IPageButtonProps) {
  return (
    <div className="flex">
      {items.map((id) => (
        <Button key={id} kind="top-page" active={selected === id} onClick={() => onSelect(id)}>
          {TAB_LABELS[id]}
        </Button>
      ))}
    </div>
  );
}
