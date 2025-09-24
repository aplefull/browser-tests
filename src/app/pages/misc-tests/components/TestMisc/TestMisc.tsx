import { Glow } from '@/app/pages/misc-tests/components/subcomponents/Glow/Glow';
import { CounterAnimation } from '@/app/pages/misc-tests/components/subcomponents/CounterAnimation/CounterAnimation';
import { SpriteVideo } from '@/app/pages/misc-tests/components/subcomponents/SpriteVideo/SpriteVideo';
import { Collapse } from '@/app/components/Collapse/Collapse';
import { DeepNesting } from '@/app/pages/misc-tests/components/TestDeepNesting/TestDeepNesting';
import { Container } from '@/app/components/Container/Container';
import React, { ReactNode, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import crashCursorSvg from '@assets/images/cursors/crashSvg.svg';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { isTruthy } from '@utils';

const Subsection = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapse unmountChildren className={styles.collapse} title={title} open={open} onChange={setOpen}>
      {children}
    </Collapse>
  );
};

export const TestMisc = () => {
  const [supportedEncodings, setSupportedEncodings] = useState<string[]>([]);

  const testEncodingDecoding = () => {
    const encodings = [
      '866',
      'adobe-standard-encoding',
      'adobe-symbol-encoding',
      'amiga-1251',
      'ansi_x3.110-1983',
      'ansi_x3.4-1968',
      'arabic',
      'ascii',
      'asmo-708',
      'asmo_449',
      'base64',
      'big5',
      'big5-hkscs',
      'binary',
      'bocu-1',
      'brf',
      'bs_4730',
      'bs_viewdata',
      'cesu-8',
      'chinese',
      'cn-big5',
      'cp1250',
      'cp1251',
      'cp1252',
      'cp1253',
      'cp1254',
      'cp1255',
      'cp1256',
      'cp1257',
      'cp1258',
      'cp50220',
      'cp51932',
      'cp819',
      'cp866',
      'csa_z243.4-1985-1',
      'csa_z243.4-1985-2',
      'csa_z243.4-1985-gr',
      'csbig5',
      'cseuckr',
      'cseucpkdfmtjapanese',
      'csgb2312',
      'csibm866',
      'csiso2022jp',
      'csiso2022kr',
      'csiso58gb231280',
      'csiso88596e',
      'csiso88596i',
      'csiso88598e',
      'csiso88598i',
      'csisolatin1',
      'csisolatin2',
      'csisolatin3',
      'csisolatin4',
      'csisolatin5',
      'csisolatin6',
      'csisolatin9',
      'csisolatinarabic',
      'csisolatincyrillic',
      'csisolatingreek',
      'csisolatinhebrew',
      'cskoi8r',
      'csksc56011987',
      'csmacintosh',
      'csn_369103',
      'csshiftjis',
      'cyrillic',
      'dec-mcs',
      'din_66003',
      'dk-us',
      'dos-874',
      'ds_2089',
      'ebcdic-at-de',
      'ebcdic-at-de-a',
      'ebcdic-ca-fr',
      'ebcdic-dk-no',
      'ebcdic-dk-no-a',
      'ebcdic-es',
      'ebcdic-es-a',
      'ebcdic-es-s',
      'ebcdic-fi-se',
      'ebcdic-fi-se-a',
      'ebcdic-fr',
      'ebcdic-it',
      'ebcdic-pt',
      'ebcdic-uk',
      'ebcdic-us',
      'ecma-114',
      'ecma-118',
      'ecma-cyrillic',
      'elot_928',
      'es',
      'es2',
      'euc-jp',
      'euc-kr',
      'extended_unix_code_fixed_width_for_japanese',
      'extended_unix_code_packed_format_for_japanese',
      'gb18030',
      'gb2312',
      'gb_1988-80',
      'gb_2312',
      'gb_2312-80',
      'gbk',
      'gost_19768-74',
      'greek',
      'greek-ccitt',
      'greek7',
      'greek7-old',
      'greek8',
      'hebrew',
      'hex',
      'hp-desktop',
      'hp-legal',
      'hp-math8',
      'hp-pi-font',
      'hp-roman8',
      'hz-gb-2312',
      'ibm-symbols',
      'ibm-thai',
      'ibm00858',
      'ibm00924',
      'ibm01140',
      'ibm01141',
      'ibm01142',
      'ibm01143',
      'ibm01144',
      'ibm01145',
      'ibm01146',
      'ibm01147',
      'ibm01148',
      'ibm01149',
      'ibm037',
      'ibm038',
      'ibm1026',
      'ibm1047',
      'ibm273',
      'ibm274',
      'ibm275',
      'ibm277',
      'ibm278',
      'ibm280',
      'ibm281',
      'ibm284',
      'ibm285',
      'ibm290',
      'ibm297',
      'ibm420',
      'ibm423',
      'ibm424',
      'ibm437',
      'ibm500',
      'ibm775',
      'ibm819',
      'ibm850',
      'ibm851',
      'ibm852',
      'ibm855',
      'ibm857',
      'ibm860',
      'ibm861',
      'ibm862',
      'ibm863',
      'ibm864',
      'ibm865',
      'ibm866',
      'ibm868',
      'ibm869',
      'ibm870',
      'ibm871',
      'ibm880',
      'ibm891',
      'ibm903',
      'ibm904',
      'ibm905',
      'ibm918',
      'iec_p27-1',
      'inis',
      'inis-8',
      'inis-cyrillic',
      'invariant',
      'iso-10646-j-1',
      'iso-10646-ucs-2',
      'iso-10646-ucs-4',
      'iso-10646-ucs-basic',
      'iso-10646-unicode-latin1',
      'iso-10646-utf-1',
      'iso-11548-1',
      'iso-2022-cn',
      'iso-2022-cn-ext',
      'iso-2022-jp',
      'iso-2022-jp-2',
      'iso-2022-kr',
      'iso-8859-1',
      'iso-8859-1-windows-3.0-latin-1',
      'iso-8859-1-windows-3.1-latin-1',
      'iso-8859-10',
      'iso-8859-11',
      'iso-8859-13',
      'iso-8859-14',
      'iso-8859-15',
      'iso-8859-16',
      'iso-8859-2',
      'iso-8859-2-windows-latin-2',
      'iso-8859-3',
      'iso-8859-4',
      'iso-8859-5',
      'iso-8859-6',
      'iso-8859-6-e',
      'iso-8859-6-i',
      'iso-8859-7',
      'iso-8859-8',
      'iso-8859-8-e',
      'iso-8859-8-i',
      'iso-8859-8i',
      'iso-8859-9',
      'iso-8859-9-windows-latin-5',
      'iso-ir-100',
      'iso-ir-101',
      'iso-ir-109',
      'iso-ir-110',
      'iso-ir-126',
      'iso-ir-127',
      'iso-ir-138',
      'iso-ir-144',
      'iso-ir-148',
      'iso-ir-149',
      'iso-ir-157',
      'iso-ir-58',
      'iso-ir-90',
      'iso-unicode-ibm-1261',
      'iso-unicode-ibm-1264',
      'iso-unicode-ibm-1265',
      'iso-unicode-ibm-1268',
      'iso-unicode-ibm-1276',
      'iso8859-1',
      'iso8859-10',
      'iso8859-11',
      'iso8859-13',
      'iso8859-14',
      'iso8859-15',
      'iso8859-2',
      'iso8859-3',
      'iso8859-4',
      'iso8859-6',
      'iso8859-7',
      'iso8859-8',
      'iso8859-9',
      'iso88591',
      'iso885910',
      'iso885911',
      'iso885913',
      'iso885914',
      'iso885915',
      'iso88592',
      'iso88593',
      'iso88594',
      'iso88595',
      'iso88596',
      'iso88597',
      'iso88598',
      'iso88599',
      'iso_10367-box',
      'iso_2033-1983',
      'iso_5427',
      'iso_5427:1981',
      'iso_5428:1980',
      'iso_646.basic:1983',
      'iso_646.irv:1983',
      'iso_6937-2-25',
      'iso_6937-2-add',
      'iso_8859-1',
      'iso_8859-1:1987',
      'iso_8859-2',
      'iso_8859-2:1987',
      'iso_8859-3',
      'iso_8859-3:1988',
      'iso_8859-4',
      'iso_8859-4:1988',
      'iso_8859-5',
      'iso_8859-5:1988',
      'iso_8859-6',
      'iso_8859-6-e',
      'iso_8859-6-i',
      'iso_8859-6:1987',
      'iso_8859-7',
      'iso_8859-7:1987',
      'iso_8859-8',
      'iso_8859-8-e',
      'iso_8859-8-i',
      'iso_8859-8:1988',
      'iso_8859-9',
      'iso_8859-9:1989',
      'iso_8859-supp',
      'it',
      'jis_c6220-1969-jp',
      'jis_c6220-1969-ro',
      'jis_c6226-1978',
      'jis_c6226-1983',
      'jis_c6229-1984-a',
      'jis_c6229-1984-b',
      'jis_c6229-1984-b-add',
      'jis_c6229-1984-hand',
      'jis_c6229-1984-hand-add',
      'jis_c6229-1984-kana',
      'jis_encoding',
      'jis_x0201',
      'jis_x0212-1990',
      'jus_i.b1.002',
      'jus_i.b1.003-mac',
      'jus_i.b1.003-serb',
      'koi',
      'koi7-switched',
      'koi8',
      'koi8-r',
      'koi8-u',
      'koi8_r',
      'korean',
      'ks_c_5601-1987',
      'ks_c_5601-1989',
      'ksc5601',
      'ksc5636',
      'ksc_5601',
      'kz-1048',
      'l1',
      'l2',
      'l3',
      'l4',
      'l5',
      'l6',
      'l9',
      'latin-greek',
      'latin-greek-1',
      'latin-lap',
      'latin1',
      'latin2',
      'latin3',
      'latin4',
      'latin5',
      'latin6',
      'latin9',
      'logical',
      'mac',
      'macintosh',
      'microsoft-publishing',
      'mnem',
      'mnemonic',
      'ms_kanji',
      'msz_7795.3',
      'nats-dano',
      'nats-dano-add',
      'nats-sefi',
      'nats-sefi-add',
      'nc_nc00-10:81',
      'nf_z_62-010',
      'nf_z_62-010_(1973)',
      'ns_4551-1',
      'ns_4551-2',
      'osd_ebcdic_df03_irv',
      'osd_ebcdic_df04_1',
      'osd_ebcdic_df04_15',
      'pc8-danish-norwegian',
      'pc8-turkish',
      'pt',
      'pt2',
      'ptcp154',
      'replacement',
      'scsu',
      'sen_850200_b',
      'sen_850200_c',
      'shift-jis',
      'shift_jis',
      'sjis',
      'sun_eu_greek',
      't.101-g2',
      't.61-7bit',
      't.61-8bit',
      'tis-620',
      'tscii',
      'ucs2',
      'unicode-1-1',
      'unicode-1-1-utf-7',
      'unicode-1-1-utf-8',
      'unknown-8bit',
      'us-ascii',
      'us-dk',
      'utf-16',
      'utf-16be',
      'utf-16le',
      'utf-32',
      'utf-32be',
      'utf-32le',
      'utf-7',
      'utf-7-imap',
      'utf-8',
      'utf8',
      'ventura-international',
      'ventura-math',
      'ventura-us',
      'videotex-suppl',
      'viqr',
      'viscii',
      'visual',
      'windows-1250',
      'windows-1251',
      'windows-1252',
      'windows-1253',
      'windows-1254',
      'windows-1255',
      'windows-1256',
      'windows-1257',
      'windows-1258',
      'windows-31j',
      'windows-874',
      'windows-949',
      'x-cp1250',
      'x-cp1251',
      'x-cp1252',
      'x-cp1253',
      'x-cp1254',
      'x-cp1255',
      'x-cp1256',
      'x-cp1257',
      'x-cp1258',
      'x-euc-jp',
      'x-gbk',
      'x-mac-cyrillic',
      'x-mac-roman',
      'x-mac-ukrainian',
      'x-sjis',
      'x-user-defined',
      'x-x-big5',
    ];

    const supportedEncodings = encodings
      .map((encoding) => {
        try {
          const decoder = new TextDecoder(encoding);
          const data = new Uint32Array([Number.MAX_SAFE_INTEGER]);
          decoder.decode(data);

          return encoding;
        } catch {
          return null;
        }
      })
      .filter(isTruthy);

    setSupportedEncodings(supportedEncodings);
  };

  useEffect(() => {
    testEncodingDecoding();
  }, []);

  return (
    <div className={styles.misc}>
      <Subsection title="Glow effect">
        <div className={styles.glow}>
          <Glow brightness={50} />
        </div>
      </Subsection>
      <Subsection title="Counter-animation">
        <CounterAnimation />
      </Subsection>
      <Subsection title="A lot of nested divs">
        <DeepNesting />
      </Subsection>
      <Subsection title="Sprite video">
        <SpriteVideo />
      </Subsection>
      <Subsection title="Iframe referencing current page">
        <iframe src={window.location.href} className={styles.iframe} />
      </Subsection>
      <Subsection title="Supported encodings">
        <Container direction="row" gap={10}>
          <span>Supported encodings:</span>
          <Json data={supportedEncodings} />
        </Container>
      </Subsection>
      <Subsection title="Some things that are bugged or inconsistent in browsers">
        <Container className={styles.examples}>
          <h2>
            Firefox can't figure out the size of svg parent, when svg only has viewBox set. Even though it gets svg size
            perfectly well.
          </h2>
          <div className={styles.replacedElementContainerSize}>
            <div>
              <svg fill="red" viewBox="0 0 30 30" className={styles.icon}></svg>
            </div>
          </div>
          <h2>SVG that crashes chrome on hover</h2>
          <div
            className={styles.crashOnHover}
            style={{
              cursor: ` url(${crashCursorSvg}), not-allowed`,
            }}
          />
          <h2>Inconsistencies in emojis</h2>
          <div className={styles.emojis}>
            <div className={styles.container}>
              <span>➗</span>
              <span>🟰</span>
              <span>♾️</span>
              <span>♾</span>
              <span>‼️</span>
              <span>‼</span>
              <span>⁉️</span>
              <span>⁉</span>
              <span>✳️</span>
              <span>✳</span>
              <span>0️⃣</span>
              <span>1️⃣</span>
              <span>2️⃣</span>
              <span>3️⃣</span>
              <span>3⃣</span>
              <span>4️⃣</span>
              <span>4⃣</span>
              <span>5️⃣</span>
              <span>6️⃣</span>
              <span>7️⃣</span>
              <span>8️⃣</span>
              <span>9️⃣</span>
              <span>🔟</span>
            </div>
            <div className={styles.container}>
              <span>➗</span>
              <span>🟰</span>
              <span>♾️</span>
              <span>♾</span>
              <span>‼️</span>
              <span>‼</span>
              <span>⁉️</span>
              <span>⁉</span>
              <span>❎</span>
              <span>🏴‍☠</span>
              <span>🇦🇨</span>
              <span>🇦🇩</span>
              <span>🇦🇪</span>
              <span>🇦🇫</span>
              <span>🇦🇬</span>
              <span>🇦🇮</span>
              <span>🇦🇱</span>
              <span>🇦🇲</span>
              <span>🇦🇴</span>
              <span>🇦🇶</span>
              <span>🇦🇷</span>
            </div>
          </div>
        </Container>
      </Subsection>
    </div>
  );
};
