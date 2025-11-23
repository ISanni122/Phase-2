const Button = (props) => {
  const { text, onClick, children, type = 'button', className = '' } = props;
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type}>
      {children || text}
    </button>
  );
};

export default Button;
