import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const rgbToHsl = ({ r, g, b }) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const getContrastText = (r, g, b, a) => {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000 * a;
  return brightness > 128 ? "black" : "white";
};

const ColorPicker = () => {
  const [color, setColor] = useState("#3498db");
  const [alpha, setAlpha] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const { r, g, b } = hexToRgb(color);
  const rgbaString = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  const hslString = rgbToHsl({ r, g, b });
  const contrastText = getContrastText(r, g, b, alpha);

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    alert(`Copied: ${value}`);
  };

  const saveFavorite = () => {
    const fav = { color, alpha };
    if (!favorites.some(f => f.color === color && f.alpha === alpha)) {
      setFavorites([...favorites, fav]);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100  flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-center">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold mb-4 sm:text-xl text-center">🎨 Color Picker</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-2 py-1 text-sm bg-gray-300 dark:bg-gray-700 rounded"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Color Input */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-32 h-16 mb-4 cursor-pointer"
          />

          {/* Opacity */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Opacity: {alpha}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Preview */}
          <div
            className="w-full h-24 rounded mb-4 flex items-center justify-center font-semibold"
            style={{ backgroundColor: rgbaString, color: contrastText }}
          >
            Preview Text
          </div>

          {/* Color Info */}
          <div className="text-left text-sm sm:text-base space-y-2 mb-4">
            <div>
              <strong>HEX:</strong> {color}
              <button onClick={() => copyToClipboard(color)} className="ml-2 text-blue-500 text-sm">Copy</button>
            </div>
            <div>
              <strong>RGBA:</strong> {rgbaString}
              <button onClick={() => copyToClipboard(rgbaString)} className="ml-2 text-blue-500 text-sm">Copy</button>
            </div>
            <div>
              <strong>HSL:</strong> {hslString}
              <button onClick={() => copyToClipboard(hslString)} className="ml-2 text-blue-500 text-sm">Copy</button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveFavorite}
            className="w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-base sm:text-sm"
          >
            ⭐ Save to Favorites
          </button>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mt-6 text-left">
              <h2 className="font-bold mb-2">🎨 Favorites:</h2>
              <div className="grid grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-2">
                {favorites.map((fav, index) => {
                  const { r, g, b } = hexToRgb(fav.color);
                  return (
                    <div
                      key={index}
                      className="h-8 w-full rounded"
                      title={`HEX: ${fav.color} | Alpha: ${fav.alpha}`}
                      style={{
                        backgroundColor: `rgba(${r}, ${g}, ${b}, ${fav.alpha})`,
                        border: "1px solid #ccc",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
