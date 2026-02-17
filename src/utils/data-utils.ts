import { type CollectionEntry } from 'astro:content';
import { slugify } from './common-utils';

export function sortItemsByDateDesc(itemA: CollectionEntry<'blog' | 'projects'>, itemB: CollectionEntry<'blog' | 'projects'>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: slugify(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tagId: string) {
    const filteredPosts: CollectionEntry<'blog'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagId));
    return filteredPosts;
}

export function getAllSeries(posts: CollectionEntry<'blog'>[]) {
    const seriesMap = new Map<string, CollectionEntry<'blog'>[]>();
    for (const post of posts) {
        const series = post.data.series;
        if (series) {
            const slug = slugify(series.name);
            if (!seriesMap.has(slug)) {
                seriesMap.set(slug, []);
            }
            seriesMap.get(slug)!.push(post);
        }
    }
    return Array.from(seriesMap.entries()).map(([slug, seriesPosts]) => {
        const sorted = seriesPosts.sort((a, b) => a.data.series!.order - b.data.series!.order);
        const firstPost = sorted[0];
        const lastPost = sorted[sorted.length - 1];
        return {
            name: firstPost.data.series!.name,
            slug,
            postCount: sorted.length,
            posts: sorted,
            latestDate: new Date(Math.max(...sorted.map(p => new Date(p.data.publishDate).getTime()))),
            firstDate: new Date(Math.min(...sorted.map(p => new Date(p.data.publishDate).getTime()))),
            image: firstPost.data.seo?.image,
        };
    });
}

export function getPostsBySeries(posts: CollectionEntry<'blog'>[], seriesSlug: string) {
    return posts
        .filter((post) => post.data.series && slugify(post.data.series.name) === seriesSlug)
        .sort((a, b) => a.data.series!.order - b.data.series!.order);
}
