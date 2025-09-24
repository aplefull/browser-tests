import foreignObjectStyle from './style.scss?raw';
import { TDimensions } from '@/types';

export const ForeignObjectSvg = ({ width, height }: TDimensions) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <foreignObject className="foreign-object-svg" x="25%" y="10%" width="50%" height="80%">
        <div style={{ backgroundColor: '#f2f2f2', padding: '10px' }}>
          <h1 style={{ margin: '0' }}>SVG + HTML</h1>
          <p>Some interactive HTML:</p>

          <form>
            <label htmlFor="name" style={{ color: '#333' }}>
              Well:
              <input type="text" id="name" name="name" placeholder="hello friends" />
            </label>
            <br />
            <button type="button">Submit</button>
          </form>
        </div>

        <style>{foreignObjectStyle}</style>
      </foreignObject>
    </svg>
  );
};
