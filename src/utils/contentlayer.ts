import { allPages, allPosts } from "contentlayer/generated";

/**
 * draft: false || null 설정된 포스트만 필터링
 */
export const allPostsWithoutDraft = allPosts.filter(post => !post.draft);

/**
 * draft: false || null 설정된 페이지만 필터링
 */
export const allPagesWithoutDraft = allPages.filter(page => !page.draft);
