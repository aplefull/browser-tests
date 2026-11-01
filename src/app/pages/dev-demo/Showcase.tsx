import allLocales from '@assets/data/locales.json';
import { ReactNode, useState } from 'react';
import classNames from 'classnames';
import { Search } from 'tabler-icons-react';
import styles from './styles.module.scss';
import { Badge } from '@/app/components/Badge/Badge';
import { Button } from '@/app/components/Button/Button';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { Code } from '@/app/components/Code/Code';
import { ContextMenu } from '@/app/components/ContextMenu/ContextMenu';
import catsVideo from '@assets/videos/cats_vp9.webm';
import winterAudio from '@assets/audio/winter.mp3';
import { Audio } from '@/app/components/Audio/Audio';
import { Video } from '@/app/components/Video/Video';
import { ColorPicker } from '@/app/components/ColorPicker/ColorPicker';
import { Color } from '@/app/components/ColorPicker/Color';
import { Collapse } from '@/app/components/Collapse/Collapse';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import { Info } from '@/app/components/Info/Info';
import { Input } from '@/app/components/Input/Input';
import { Loader } from '@/app/components/Loader/Loader';
import { NumberInput } from '@/app/components/NumberInput/NumberInput';
import { RadioButton } from '@/app/components/RadioButton/RadioButton';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { Select } from '@/app/components/Select/Select';
import { Switcher } from '@/app/components/Switcher/Switcher';
import { Table } from '@/app/components/Table/Table';
import { TextArea } from '@/app/components/TextArea/TextArea';

const fruits = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig', 'Grape'];

const groups = [
  { group: 'Formats', items: ['Collator', 'DateTimeFormat', 'ListFormat', 'NumberFormat'] },
  { group: 'Rules', items: ['PluralRules', 'RelativeTimeFormat'] },
  { group: 'Other', items: ['DisplayNames', 'Locale', 'Segmenter'] },
];

const objectOptions = [
  { label: 'Cats', value: '/assets/cats.mp4' },
  { label: 'Big Buck Bunny', value: '/assets/bunny.webm' },
  { label: 'Sintel', value: '/assets/sintel.mkv' },
];

const longOptions = [
  'Short',
  'A considerably longer option label that has to wrap onto a second line',
  'Supercalifragilisticexpialidocious_without_any_spaces_at_all_to_break_on',
];

const manyOptions = Array.from({ length: 20000 }, (_, index) => `Item ${index + 1}`);

const tableColumns = [
  { key: 'feature', header: 'Feature', width: '40%' },
  { key: 'supported', header: 'Supported', align: 'center' as const },
  { key: 'note', header: 'Note' },
];

const tableData = [
  { feature: ':has()', supported: <Badge variant="success">Yes</Badge>, note: 'Relational selector' },
  { feature: '@scope', supported: <Badge variant="danger">No</Badge>, note: 'Scoped styles' },
  { feature: 'field-sizing', supported: <Badge variant="warning">Partial</Badge>, note: 'Auto-sizing inputs' },
  { feature: 'anchor()', supported: <Badge>Manual</Badge>, note: 'Anchor positioning' },
];

type TDemoProps = {
  title: string;
  children: ReactNode;
  wide?: boolean;
};

const Demo = ({ title, children, wide }: TDemoProps) => {
  return (
    <div className={classNames(styles.demoCard, { [styles.wide]: wide })}>
      <span className={styles.demoTitle}>{title}</span>
      <div className={styles.demoBody}>{children}</div>
    </div>
  );
};

export const Showcase = () => {
  const [fruit, setFruit] = useState<string>();
  const [locale, setLocale] = useState('en-US');
  const [group, setGroup] = useState('NumberFormat');
  const [video, setVideo] = useState(objectOptions[1].value);
  const [clearable, setClearable] = useState<string | undefined>('Cherry');
  const [long, setLong] = useState(longOptions[1]);
  const [many, setMany] = useState('Item 10000');

  const [text, setText] = useState('Hello');
  const [area, setArea] = useState('Multi-line\ntext');
  const [number, setNumber] = useState(5);
  const [decimal, setDecimal] = useState(0.5);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('a');
  const [range, setRange] = useState(40);
  const [fineRange, setFineRange] = useState(0.5);
  const [collapsed, setCollapsed] = useState(false);
  const [hsvColor, setHsvColor] = useState(() => new Color().parse('rgba(229, 72, 77, 0.8)'));
  const [hslColor, setHslColor] = useState(() => new Color().parse('hsl(210 70% 45%)'));
  const [transparentColor, setTransparentColor] = useState(() => new Color().parse('transparent'));

  const localeIndex = allLocales.indexOf(locale);
  const shiftLocale = (offset: number) => {
    setLocale(allLocales[(localeIndex + offset + allLocales.length) % allLocales.length]);
  };

  return (
    <div className={styles.showcase}>
      <h2>Select</h2>
      <div className={styles.grid}>
        <Demo title="Placeholder">
          <Select options={fruits} value={fruit} onChange={setFruit} />
          <span className={styles.state}>value: {String(fruit)}</span>
        </Demo>
        <Demo title={`Searchable, ${allLocales.length} locales, in Switcher`}>
          <Switcher onPrev={() => shiftLocale(-1)} onNext={() => shiftLocale(1)}>
            <Select options={allLocales} value={locale} onChange={setLocale} searchable />
          </Switcher>
          <span className={styles.state}>value: {locale}</span>
        </Demo>
        <Demo title="20 000 options">
          <Select options={manyOptions} value={many} onChange={setMany} searchable />
          <span className={styles.state}>value: {many}</span>
        </Demo>
        <Demo title="Groups, searchable">
          <Select options={groups} value={group} onChange={setGroup} searchable />
          <span className={styles.state}>value: {group}</span>
        </Demo>
        <Demo title="Label, object options">
          <Select label="Video" options={objectOptions} value={video} onChange={setVideo} />
          <span className={styles.state}>value: {video}</span>
        </Demo>
        <Demo title="Clearable">
          <Select
            options={fruits}
            value={clearable}
            onChange={setClearable}
            onClear={() => setClearable(undefined)}
            clearable
          />
          <span className={styles.state}>value: {String(clearable)}</span>
        </Demo>
        <Demo title="Wrap words">
          <Select options={longOptions} value={long} onChange={setLong} wrapWords />
        </Demo>
        <Demo title="Disabled, empty">
          <Select options={fruits} value="Banana" onChange={() => {}} disabled />
          <Select options={[]} onChange={() => {}} searchable placeholder="No options" />
        </Demo>
      </div>

      <h2>Inputs</h2>
      <div className={styles.grid}>
        <Demo title="Input">
          <Input value={text} onChange={setText} placeholder="Placeholder" />
          <Input
            value=""
            onChange={() => {}}
            placeholder="With slot"
            leftSlot={<Search size={14} className={styles.slot} />}
          />
          <Input value="Disabled" disabled />
        </Demo>
        <Demo title="TextArea">
          <TextArea value={area} onChange={setArea} />
          <TextArea value="Read only" readonly />
        </Demo>
        <Demo title="NumberInput">
          <NumberInput value={number} onChange={setNumber} min={0} max={10} />
          <NumberInput value={decimal} onChange={setDecimal} step={0.1} min={0} max={1} />
          <NumberInput value={3} onChange={() => {}} disabled />
          <span className={styles.state}>
            value: {number}, {decimal}
          </span>
        </Demo>
        <Demo title="RangeInput">
          <RangeInput value={range} onChange={setRange} label={`Value: ${range}`} />
          <RangeInput
            value={fineRange}
            onChange={setFineRange}
            min={0}
            max={1}
            step={0.01}
            label="Left"
            labelPosition="left"
          />
          <RangeInput value={30} onChange={() => {}} label="Disabled" disabled />
        </Demo>
        <Demo title="Checkbox, RadioButton">
          <Checkbox checked={checked} onChange={setChecked} label="Checkbox" />
          <Checkbox checked={false} onChange={() => {}} label="Disabled" disabled />
          <Checkbox checked onChange={() => {}} label="Label left" labelPosition="left" />
          <div className={styles.row}>
            {['a', 'b', 'c'].map((option) => (
              <label key={option} className={styles.radio}>
                <RadioButton name="showcase-radio" checked={radio === option} onChange={() => setRadio(option)} />
                <span>{option}</span>
              </label>
            ))}
            <RadioButton checked disabled />
          </div>
        </Demo>
        <Demo title="ColorPicker">
          <div className={styles.row}>
            <ColorPicker value={hsvColor} onChange={setHsvColor} />
            <ColorPicker value={hslColor} onChange={setHslColor} type="HSL" />
            <ColorPicker value={transparentColor} onChange={setTransparentColor} />
          </div>
          <span className={styles.state}>
            {hsvColor.toRGBAString()}, {hslColor.toHSLAString()}
          </span>
          <Button
            text="Reset"
            variant="outline"
            onClick={() => setTransparentColor(new Color().parse('transparent'))}
          />
        </Demo>
        <Demo title="Button">
          <div className={styles.row}>
            <Button text="Solid" />
            <Button text="Outline" variant="outline" />
          </div>
          <div className={styles.row}>
            <Button text="Disabled" disabled />
            <Button text="Disabled" variant="outline" disabled />
          </div>
          <Button text="Link" variant="outline" url="https://example.com" />
        </Demo>
      </div>

      <h2>Media</h2>
      <div className={styles.grid}>
        <Demo title="Video" wide>
          <Video className={styles.video} src={catsVideo} />
        </Demo>
        <Demo title="Audio" wide>
          <Audio src={winterAudio} defaultVolume={0.5} defaultLoop />
          <Audio src="/missing.mp3" />
        </Demo>
        <Demo title="Video error">
          <Video className={styles.smallVideo} src="/missing.webm" />
        </Demo>
      </div>

      <h2>Display</h2>
      <div className={styles.grid}>
        <Demo title="Badge, Info, ErrorMessage">
          <div className={styles.row}>
            <Badge variant="success">Pass</Badge>
            <Badge variant="danger">Fail</Badge>
            <Badge variant="warning">Partial</Badge>
            <Badge>Manual</Badge>
            <Info text="Tooltip text shown on hover" />
          </div>
          <ErrorMessage message="Something went wrong" />
        </Demo>
        <Demo title="Code, Loader">
          <Code>{'const value = await navigator.gpu.requestAdapter();'}</Code>
          <div className={styles.loader}>
            <Loader size={32} />
          </div>
        </Demo>
        <Demo title="Collapse">
          <Collapse title="Collapsible" open={collapsed} onChange={setCollapsed}>
            <div className={styles.collapseBody}>Content</div>
          </Collapse>
        </Demo>
        <Demo title="ContextMenu">
          <ContextMenu content={<div className={styles.menuItem}>Menu item</div>}>
            <div className={styles.contextArea}>Right click</div>
          </ContextMenu>
        </Demo>
        <Demo title="Table" wide>
          <Table columns={tableColumns} data={tableData} compact />
          <Table columns={tableColumns} data={[]} />
        </Demo>
      </div>
    </div>
  );
};
