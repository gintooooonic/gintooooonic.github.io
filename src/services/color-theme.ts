export default class ColorThemeService {
  private static readonly LOCAL_STORAGE_KEY = "is-dark-mode";

  /**
   * 다크 모드 여부 반환 (우선순위 : localStorage > OS)
   */
  static isDarkMode(): boolean {
    return this.isDarkModeFromStorage() ?? this.isDarkModeFromOS();
  }

  private static isDarkModeFromStorage(): boolean | null {
    const value = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (value === null) return null;

    return value === LocalStorageValue.TRUE;
  }

  private static isDarkModeFromOS(): boolean {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /**
   * localStorage에 설정 저장
   */
  static set(isDarkMode: boolean): void {
    const value = isDarkMode ? LocalStorageValue.TRUE : LocalStorageValue.FALSE;
    localStorage.setItem(this.LOCAL_STORAGE_KEY, value);
  }
}

enum LocalStorageValue {
  TRUE = "true",
  FALSE = "false",
}
