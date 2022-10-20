import React from "react";

interface Props {
  href: string;
}

const Icon: React.FC<Props> = (props) => {
  return (
    // anticon类是为了在侧边栏收起的时候menu中的icon样式
    <svg className="icon anticon" aria-hidden="true" style={{color:"#fff"}}>
      <use xlinkHref={props.href} />
    </svg>
  );
};

export default Icon;
