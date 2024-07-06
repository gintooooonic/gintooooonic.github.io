import { allPosts, Post } from "contentlayer/generated";

export default class Posts {
  /**
   * @returns draft를 제외한 모든 포스트 목록
   */
  static findAll(): Post[] {
    return allPosts.filter(post => !post.draft);
  }

  /**
   * @param postId 포스트 slug (= postId)
   * @returns 포스트 단건
   */
  static findOne(postId: string): Post {
    const post = this.findAll().find(post => post.slug === postId);
    if (!post) {
      throw new Error(`'${postId}' 포스트를 찾을 수 없습니다.`);
    }

    return post;
  }

  /**
   * @returns 모든 포스트 id 목록
   */
  static findAllPostIds(): string[] {
    return this.findAll().map(post => post.slug);
  }

  /**
   * @returns 전체 카테고리명 목록 (오름차순)
   */
  static findAllCategories(): string[] {
    return Array.from(new Set(this.findAll().map(post => post.category))).sort();
  }
}
