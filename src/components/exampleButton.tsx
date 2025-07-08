import { useState } from 'react';

import { Button, PageButton, SelectButton, type TabId } from '@/components/common/button';

export default function exampleButton() {
  const [selectedTop1, setSelectedTop1] = useState<TabId>('basic');
  const [selectedTop2, setSelectedTop2] = useState<TabId>('review');
  return (
    <div>
      <section>
        <h2 className="text-lg font-semibold">Basic Buttons</h2>
        <Button kind="basic" variant="solid-orange" onClick={() => {}}>
          Solid Orange
        </Button>
        <Button kind="basic" variant="outline-gray" onClick={() => {}}>
          Outline Gray
        </Button>
        <Button kind="basic" variant="solid-gray" onClick={() => {}}>
          Solid Gray
        </Button>
        <Button kind="basic" variant="outline-orange" onClick={() => {}}>
          Outline Orange
        </Button>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Select Bottom Buttons</h2>
        <SelectButton
          kind="select-bottom"
          leftText="Left Outline"
          rightText="Right Orange"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
        <SelectButton
          kind="select-bottom"
          leftText="Left Solid"
          rightText="Right Orange"
          leftVariant="left-solid"
          rightVariant="right-orange"
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold">Select Content Buttons</h2>
        <SelectButton
          kind="select-content"
          leftText="Disabled"
          rightText="Outline Gray"
          leftVariant="disabled"
          rightVariant="outline-gray"
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
        <SelectButton
          kind="select-content"
          leftText="Outline Orange"
          rightText="Outline Gray"
          leftVariant="outline-orange"
          rightVariant="outline-gray"
          onLeftClick={() => {}}
          onRightClick={() => {}}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold">Top Page Buttons</h2>
        <PageButton items={['basic', 'industry']} selected={selectedTop1} onSelect={setSelectedTop1} />
        <PageButton items={['review', 'team']} selected={selectedTop2} onSelect={setSelectedTop2} />
      </section>
    </div>
  );
}
