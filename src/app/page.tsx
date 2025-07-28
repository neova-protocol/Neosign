import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>


NEOSIGN : 

      <a href="/login">
        <button type="button" className={styles.button}>
          Go to Login
        </button>
      </a>



      </main>

    </div>
  );
}
