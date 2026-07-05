"use client";

import Image from "next/image";
import { motion } from "motion/react";
import styles from "./TeamCard.module.css";

export default function TeamCard({ member, index }) {
  const { name, role, email, phone, photo, bio } = member;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={photo}
        alt={`Photo of ${name}`}
        width={160}
        height={160}
        className={styles.photo}
      />
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.role}>{role}</p>
      <p className={styles.bio}>{bio}</p>
      <div className={styles.contacts}>
        <a href={`mailto:${email}`} className={styles.contact}>
          {email}
        </a>
        <a href={`tel:${phone}`} className={styles.contact}>
          {phone}
        </a>
      </div>
    </motion.article>
  );
}
