import Link from "next/link";
const LinkText = ({ href, refresh = false, ...props }) => {
  return (
    <>
      {refresh ? (
        <a href={href || props.to} style={{ textDecoration: "none" }}>
          {props.children}
        </a>
      ) : (
        <Link href={href || props.to}>
          <a style={{ textDecoration: "none" }}>{props.children}</a>
        </Link>
      )}
    </>
  );
};
export default LinkText;
