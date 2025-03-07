// import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ css, size, loading }) => {
  return (
    <div className="spinner-border spinner-border-sm text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
