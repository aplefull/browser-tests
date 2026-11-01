import styles from './styles.module.scss';
import { TDimensions } from '@/types';
import { useLayoutEffect, useRef, useState } from 'react';
import { RadioButton } from '@/app/components/RadioButton/RadioButton';

const spiralText =
  '田中さんにあげて下さい パーティーへ行かないか 和製漢語 部落格 사회과학원 어학연구소 찦차를 타고 온 펲시맨과 쑛다리 똠방각하 社會科學院語學研究所 울란바토르 𠜎𠜱𠝹𠱓𠱸𠲖𠳏';

const nonStandardUnicode = '𐐜 𐐔𐐇𐐝𐐀𐐡𐐇𐐓 𐐙𐐊𐐡𐐝𐐓/𐐝𐐇𐐗𐐊𐐤𐐔 𐐒𐐋𐐗';
const emojis = '💔 💌 💕 💞 💓 💗 💖 💘';
const drawing = '᚛ᚄᚓᚐᚋᚒᚄ ᚑᚄᚂᚑᚏᚅ᚜';
const obfuscatedText = ' Ṱ̺̺̕o͞ ̷i̲̬͇̪͙n̝̗͕v̟̜̘̦͟o̶̙̰̠kè͚̮̺̪̹̱̤ ̖t̝͕̳̣̻̪͞h̼͓̲̦̳̘̲e͇̣̰̦̬͎ ̢̼̻̱̘h͚͎͙̜̣̲ͅi̦̲̣̰̤v̻͍e̺̭̳̪̰-m̢iͅn̖̺̞̲̯̰d̵̼̟͙̩̼̘̳ ̞̥̱̳̭r̛̗̘e͙p͠r̼̞̻̭̗e̺̠̣͟s̘͇̳͍̝͉e͉̥̯̞̲͚̬͜ǹ̬͎͎̟̖͇̤t͍̬̤͓̼̭͘ͅi̪̱n͠g̴͉ ͏͉ͅc̬̟h͡a̫̻̯͘o̫̟̖͍̙̝͉s̗̦̲.̨̹͈̣ ̡̞̠̫̰ ̗̺͖̹̯͓Ṯ̤͍̥͇͈h̲́e͏͓̼̗̙̼̣͔ ͇̜̱̠͓͍ͅN͕͠e̗̱z̘̝̜̺͙p̤̺̹͍̯͚e̠̻̠͜r̨̤͍̺̖͔̖̖d̠̟̭̬̝͟i̦͖̩͓͔̤a̠̗̬͉̙n͚͜ ̻̞̰͚ͅh̵͉i̳̞v̢͇ḙ͎͟-҉̭̩̼͔m̤̭̫i͕͇̝̦n̗͙ḍ̟ ̯̲͕͞ǫ̟̯̰̲͙̻̝f ̪̰̰̗̖̭̘͘c̦͍̲̞͍̩̙ḥ͚a̮͎̟̙͜ơ̩̹͎s̤.̝̝ ҉Z̡̖̜͖̰̣͉̜a͖̰͙̬͡l̲̫̳͍̩g̡̟̼̱͚̞̬ͅo̗͜.';
const outBoxCharacters = '̟ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็';
const biDirectionalText = 'שלום עולם';
const biDirectionalText2 = ' ­؀؁؂؃؄؅؜۝܏᠎​‌‍‎‏‪‫‬‭‮⁠⁡⁢⁣⁤⁦⁧⁨⁩⁪⁫⁬⁭';

const options = [
  {
    name: '1',
    path: 'M0,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50',
    fontSize: 4,
    text: spiralText,
  },
  {
    name: '2',
    path: 'M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z',
    fontSize: 12.7,
    text: 'abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcb',
  },
  {
    name: '3',
    path: 'M 0 20 A 50 50 0 1 1 150 350 Q 250 550 300 300 Q 350 50 400 350 C 450 350 450 50 500 250 C 500 300 550 550 650 300 A 50 50 0 1 1 700 300',
    fontSize: 22,
    text: [
      nonStandardUnicode,
      emojis,
      drawing,
      obfuscatedText,
      biDirectionalText,
      biDirectionalText2,
      outBoxCharacters,
    ].join(''),
  },
];

const PADDING = 0.05;

export const TextPathSvg = ({ width, height }: TDimensions) => {
  const [option, setOption] = useState(options[0]);
  const [viewBox, setViewBox] = useState<string>();
  const textRef = useRef<SVGTextElement>(null);

  useLayoutEffect(() => {
    let cancelled = false;

    const fit = () => {
      if (cancelled || !textRef.current) return;

      const bbox = textRef.current.getBBox();
      const padding = Math.max(bbox.width, bbox.height) * PADDING;

      setViewBox(`${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
    };

    fit();
    document.fonts.ready.then(fit).catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [option]);

  return (
    <div>
      <div className={styles.inputs}>
        <form>
          {options.map((item) => (
            <label key={item.name}>
              <RadioButton name="text-path-option" checked={option === item} onChange={() => setOption(item)} />
              <span>{item.name}</span>
            </label>
          ))}
        </form>
      </div>
      <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="text-path" d={option.path} />
        </defs>
        <text ref={textRef} fontSize={option.fontSize}>
          <textPath fill="aliceblue" href="#text-path">
            {option.text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
