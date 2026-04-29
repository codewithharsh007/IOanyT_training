// Breadcrumb navigation.
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => (
  <nav className="text-sm text-slate-500">
    <ol className="flex items-center gap-2">
      {items.map((item, index) => (
        <li key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-slate-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span>/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
