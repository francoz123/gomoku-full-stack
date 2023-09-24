import Logo from './Logo';
import styles from './Header.module.css';
import UserLogin from './UserLogin';

// Returns the header elements
function Header() {
  return (
    <header className={styles.header}>
        <Logo />
        <UserLogin />
    </header>
  )
}

export default Header