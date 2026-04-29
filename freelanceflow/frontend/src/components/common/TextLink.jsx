// Inline text link.
import { Link } from 'react-router-dom';

const TextLink = ({ to, href, onClick, children, className = '' }) => {
  if (to) {
    return (
      <Link to={to} className={`text-blue-600 hover:text-blue-700 ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} className={`text-blue-600 hover:text-blue-700 ${className}`}>
      {children}
    </a>
  );
};

export default TextLink;
