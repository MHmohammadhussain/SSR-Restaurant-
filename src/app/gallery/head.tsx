import { absoluteUrl } from '@/lib/seo';

export default function Head() {
  const title = 'Gallery — SSR Restaurant';
  const description = 'View dishes, ambience, and moments from SSR Restaurant.';
  const url = absoluteUrl('/gallery');
  const image = absoluteUrl('/gallery/25.webp');

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
