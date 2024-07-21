import React, { useState, CSSProperties } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker, ColorResult, RGBColor } from 'react-color';

interface ColorSelectProps {
  initialColor?: RGBColor;
  onChange?: (color: RGBColor) => void;
}

interface Position {
  position: 'absolute' | 'fixed';
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export const ColorSelect: React.FC<ColorSelectProps> = ({ initialColor, onChange }) => {
  const defaultColor: RGBColor = { r: 0, g: 0, b: 0, a: 1 };
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState<RGBColor>(initialColor || defaultColor);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (colorResult: ColorResult) => {
    setColor(colorResult.rgb);
    onChange?.(colorResult.rgb);
  };

  const styles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute' as Position['position'],
        zIndex: 2,
      },
      cover: {
        position: 'fixed' as Position['position'],
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover as CSSProperties}>
          <div style={styles.cover as CSSProperties} onClick={handleClose}/>
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
}
