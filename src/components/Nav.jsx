import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../data/navigation.js';
import logoUrl from '../../assets/img/logo.jpg';

function Arrow() {
  return (
    <svg className="ar" viewBox="0 0 10 6" fill="currentColor" aria-hidden="true">
      <path d="M0 0l5 6 5-6z" />
    </svg>
  );
}

function groupItems(group) {
  return group.items || group;
}

function isActive(item, pathname) {
  if (item.to === pathname) return true;
  if (item.key === 'index' && pathname === '/') return true;
  if (!item.groups) return false;
  return item.groups.some((group) =>
    groupItems(group).some((child) => child.to === pathname)
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  return (
    <nav>
      <div className="navi">
        <Link className="logo" to="/" aria-label="V J Desai & Co. LLP, Home" style={{ lineHeight: 0 }} onClick={close}>
          <img
            src={logoUrl}
            alt="V J Desai & Co. LLP, Chartered Accountants"
            style={{ height: '100px', width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </Link>

        <ul className={`navl${open ? ' open' : ''}`} id="navl">
          {navItems.map((item) => (
            <li className="ni" data-page={item.key} key={item.key}>
              <Link className={`nl${isActive(item, pathname) ? ' active' : ''}`} to={item.to} onClick={close}>
                {item.label}
                {item.groups && <Arrow />}
              </Link>

              {item.groups && (
                <div className="dd">
                  {item.groups.map((group, index) => (
                    <div className="dds" key={`${item.key}-${index}`}>
                      {group.title && <div className="ddl">{group.title}</div>}
                      {groupItems(group).map((child) => (
                        <Link className="dda" to={child.to} key={child.to} onClick={close}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
          <Link className="ncta" to="/contact" onClick={close}>Book a Consultant</Link>
          <button
            className="ntog"
            id="ntog"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
