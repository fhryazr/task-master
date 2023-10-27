import PropTypes from "prop-types";

function BackgroundColorPicker({
  showColorPicker,
  setShowColorPicker,
  backgroundColor,
  setBackgroundColor,
}) {
  const handleColorChange = (color) => {
    setBackgroundColor(color);
  };

  const colorOptions = [
    { label: "Putih", color: "#ffffff" },
    { label: "Merah", color: "#ff0000" },
    { label: "Hijau", color: "#00ff00" },
    { label: "Biru", color: "#0000ff" },
    { label: "Kuning", color: "#ffff00" },
  ];

  return (
    <div style={{ display: showColorPicker ? "block" : "none" }}>
      <h2>Pilih Warna Latar Belakang</h2>
      <div>
        {colorOptions.map((option) => (
          <button
            key={option.color}
            style={{
              backgroundColor: option.color,
              width: "30px",
              height: "30px",
              margin: "5px",
              border: "2px solid #000",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => handleColorChange(option.color)}
          ></button>
        ))}
      </div>
      <div>
        <h3>Pratinjau Warna Latar Belakang:</h3>
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: backgroundColor,
          }}
        ></div>
      </div>
    </div>
  );
}

BackgroundColorPicker.propTypes = {
  showColorPicker: PropTypes.bool.isRequired,
  setShowColorPicker: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  setBackgroundColor: PropTypes.func.isRequired,
};

export default BackgroundColorPicker;
