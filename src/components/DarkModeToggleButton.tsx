import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

/**
 * Dark/Light 모드 토글 버튼 컴포넌트
 */
export default function DarkModeToggleButton(props: DarkModeToggleButtonProps) {
  const iconSize = props.iconSize ?? DEFAULT_ICON_SIZE;

  return (
    <button onClick={props.onClick}>
      {props.isDarkMode ? (
        <MdOutlineDarkMode size={iconSize} />
      ) : (
        <MdOutlineLightMode size={iconSize} />
      )}
    </button>
  );
}

interface DarkModeToggleButtonProps {
  isDarkMode: boolean;
  onClick: () => void;
  iconSize?: number;
}

const DEFAULT_ICON_SIZE = 20; // px
