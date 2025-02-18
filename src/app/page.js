import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import Header from '@components/header/header';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>
     
    </div>
  );
}
