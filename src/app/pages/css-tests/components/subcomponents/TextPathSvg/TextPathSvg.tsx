import styles from './styles.module.scss';
import { CSS } from '@/utils/utils';
import { TDimensions } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { RadioButton } from '@/app/components/RadioButton/RadioButton';

const SpiralText = ({ width }: TDimensions) => {
  const text =
    '田中さんにあげて下さい パーティーへ行かないか 和製漢語 部落格 사회과학원 어학연구소 찦차를 타고 온 펲시맨과 쑛다리 똠방각하 社會科學院語學研究所 울란바토르 𠜎𠜱𠝹𠱓𠱸𠲖𠳏';

  const scale = 2.7;

  return (
    <text
      style={{
        fontSize: '4px',
        transform: `scale(${scale}) translateX(${width / (2 * scale)}px) translateX(-50%)`,
        transformBox: 'fill-box',
      }}
    >
      <textPath fill="aliceblue" href="#text-path-1">
        {text}
      </textPath>
    </text>
  );
};

const PathText = ({ width, height }: TDimensions) => {
  const [textTransform, setTextTransform] = useState({ x: 0, y: 0, scale: 1 });
  const textRef = useRef<SVGTextElement>(null);

  const nonStandardUnicode = '𐐜 𐐔𐐇𐐝𐐀𐐡𐐇𐐓 𐐙𐐊𐐡𐐝𐐓/𐐝𐐇𐐗𐐊𐐤𐐔 𐐒𐐋𐐗';
  const emojis = '💔 💌 💕 💞 💓 💗 💖 💘';
  const drawing = '᚛ᚄᚓᚐᚋᚒᚄ ᚑᚄᚂᚑᚏᚅ᚜';
  const obfuscatedText = ' Ṱ̺̺̕o͞ ̷i̲̬͇̪͙n̝̗͕v̟̜̘̦͟o̶̙̰̠kè͚̮̺̪̹̱̤ ̖t̝͕̳̣̻̪͞h̼͓̲̦̳̘̲e͇̣̰̦̬͎ ̢̼̻̱̘h͚͎͙̜̣̲ͅi̦̲̣̰̤v̻͍e̺̭̳̪̰-m̢iͅn̖̺̞̲̯̰d̵̼̟͙̩̼̘̳ ̞̥̱̳̭r̛̗̘e͙p͠r̼̞̻̭̗e̺̠̣͟s̘͇̳͍̝͉e͉̥̯̞̲͚̬͜ǹ̬͎͎̟̖͇̤t͍̬̤͓̼̭͘ͅi̪̱n͠g̴͉ ͏͉ͅc̬̟h͡a̫̻̯͘o̫̟̖͍̙̝͉s̗̦̲.̨̹͈̣ ̡̞̠̫̰ ̗̺͖̹̯͓Ṯ̤͍̥͇͈h̲́e͏͓̼̗̙̼̣͔ ͇̜̱̠͓͍ͅN͕͠e̗̱z̘̝̜̺͙p̤̺̹͍̯͚e̠̻̠͜r̨̤͍̺̖͔̖̖d̠̟̭̬̝͟i̦͖̩͓͔̤a̠̗̬͉̙n͚͜ ̻̞̰͚ͅh̵͉i̳̞v̢͇ḙ͎͟-҉̭̩̼͔m̤̭̫i͕͇̝̦n̗͙ḍ̟ ̯̲͕͞ǫ̟̯̰̲͙̻̝f ̪̰̰̗̖̭̘͘c̦͍̲̞͍̩̙ḥ͚a̮͎̟̙͜ơ̩̹͎s̤.̝̝ ҉Z̡̖̜͖̰̣͉̜a͖̰͙̬͡l̲̫̳͍̩g̡̟̼̱͚̞̬ͅo̗͜.';
  const outBoxCharacters = '̟ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็';
  const biDirectionalText = 'שלום עולם';
  const biDirectionalText2 = ' ­؀؁؂؃؄؅؜۝܏᠎​‌‍‎‏‪‫‬‭‮⁠⁡⁢⁣⁤⁦⁧⁨⁩⁪⁫⁬⁭';

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      const x = width / 2 - (bbox.x + bbox.width / 2);
      const y = height / 2 - (bbox.y + bbox.height / 2);
      const scale = Math.min((width * 0.9) / bbox.width, (height * 0.9) / bbox.height, 1);

      setTextTransform({ x, y, scale });
    }
  }, [width, height]);

  return (
    <text
      ref={textRef}
      style={{
        fontSize: CSS.px(22),
        transformOrigin: 'center',
        transform: `translate(${textTransform.x}px, ${textTransform.y}px) scale(${textTransform.scale}) translateY(-15%) scale(1.5)`,
        transformBox: 'fill-box',
      }}
    >
      <textPath fill="aliceblue" href="#text-path-2">
        {nonStandardUnicode}
        {emojis}
        {drawing}
        {obfuscatedText}
        {biDirectionalText}
        {biDirectionalText2}
        {outBoxCharacters}
      </textPath>
    </text>
  );
};

const CircleText = ({ width, height }: TDimensions) => {
  const scale = 1.8;

  return (
    <text
      style={{
        fontSize: 12.7,
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transform: `translate(${width / 2}px, ${height / 2}px) translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <textPath fill="aliceblue" href="#text-path-3">
        abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcb
      </textPath>
    </text>
  );
};

export const TextPathSvg = ({ width, height }: TDimensions) => {
  const [option, setOption] = useState<'1' | '2' | '3'>('1');

  return (
    <div>
      <div className={styles.inputs}>
        <form>
          <label>
            <RadioButton checked={option === '1'} onChange={() => setOption('1')} />
            <span>1</span>
          </label>
          <label>
            <RadioButton checked={option === '2'} onChange={() => setOption('2')} />
            <span>2</span>
          </label>
          <label>
            <RadioButton checked={option === '3'} onChange={() => setOption('3')} />
            <span>3</span>
          </label>
        </form>
      </div>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="text-path-1"
            fill="none"
            d="M0,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50"
          />
          <path
            id="text-path-2"
            fill="none"
            d="M 0 20 A 50 50 0 1 1 150 350 Q 250 550 300 300 Q 350 50 400 350 C 450 350 450 50 500 250 C 500 300 550 550 650 300 A 50 50 0 1 1 700 300 "
          />
          <path id="text-path-3" fill="none" d="M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z" />
        </defs>

        {option === '1' && <SpiralText width={width} height={height} />}
        {option === '2' && <CircleText width={width} height={height} />}
        {option === '3' && <PathText width={width} height={height} />}
      </svg>
    </div>
  );
};
