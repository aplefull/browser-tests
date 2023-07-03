import styles from './styles.module.scss';

export default function TestCssFunctions() {
  const trigFunctions = [
    { func: 'sin', value: '30deg', type: 'number' },
    { func: 'cos', value: 'e / pi', type: 'number' },
    { func: 'tan', value: 'calc(0.3turn + 10009221420deg)', type: 'number' },
    { func: 'asin', value: '0.3', type: 'angle' },
    { func: 'acos', value: '-0.965', type: 'angle' },
    { func: 'atan', value: 'e / 2', type: 'angle' },
    { func: 'atan2', value: '7rem, -43px', type: 'angle' },
  ];

  return (
    <section className={styles.cssFunctions}>
      <h1>CSS functions</h1>
      <div className={styles.trigFunctions}>
        {trigFunctions.map(({ func, value, type }, index) => {
          const style =
            type === 'number'
              ? { width: `calc(100px * ${func}(${value}))` }
              : { transform: `rotate(${func}(${value}))`, aspectRatio: '1/1', marginTop: '1rem' };

          return (
            <div key={index} style={style}>
              <span>{`${func}()`}</span>
            </div>
          );
        })}
        <div
          style={{
            marginTop: '1rem',
            width: 'calc(200px * sin(cos(tan(cos(cos(sin(sin(cos(sin(cos(tan(tan(1 / cos(56deg))))))))))))))',
          }}
        >
          <span>nesting</span>
        </div>
      </div>
      <div>
        <div style={{ width: 'calc(10px * exp(pi))' }}>exp()</div>
        <div style={{ width: 'calc(10px * log(e, pi))' }}>log()</div>
        <div style={{ width: 'mod(19rem, 5rem)' }}>mod()</div>
        <div style={{ width: 'calc(10px * pow(0.3, 15))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(0, 0))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(-5, 0.3))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(1.000001, 200000))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(5, -3))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(0, -0))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(1, -1))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(-1, -1))' }}>pow()</div>
        <div style={{ width: 'calc(10px * pow(0, 1))' }}>pow()</div>
        <div style={{ width: 'rem(18px, 5px)' }}>rem()</div>
        <div style={{ width: 'calc(10px * 2)' }}>rem()</div>
      </div>
    </section>
  );
}
