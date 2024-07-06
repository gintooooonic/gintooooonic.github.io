import { allPages, Page } from "contentlayer/generated";

export default class Pages {
  /**
   * @returns draft를 제외한 모든 페이지 목록
   */
  static findAll(): Page[] {
    return allPages.filter(page => !page.draft);
  }

  /**
   * @param pageId 페이지 slug (= pageId)
   * @returns 페이지 단건
   */
  static findOne(pageId: string): Page {
    const page = this.findAll().find(page => page.slug === pageId);
    if (!page) {
      throw new Error(`'${pageId}' 페이지를 찾을 수 없습니다.`);
    }

    return page;
  }

  /**
   * @returns 모든 페이지 id 목록
   */
  static findAllPageIds(): string[] {
    return this.findAll().map(page => page.slug);
  }
}
