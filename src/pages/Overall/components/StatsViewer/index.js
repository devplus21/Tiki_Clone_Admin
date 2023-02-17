import "./style.scss";

const StatsViewer = ({ title, value, color, description, iconEl }) => {
  return (
    <div className="stats__viewer">
      <div
        className="stats__viewer-icon"
        style={{ backgroundColor: color || "black" }}
      >
        {iconEl}
      </div>
      <div className="stats__viewer-main">
        <div className="stats__viewer-title">{title}</div>
        <div className="stats__viewer-value">{value}</div>
      </div>
      <div className="stats__viewer-description" dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );
};

export default StatsViewer;
