import PostCard from "../components/PostCard";
import SectionHeading from "../components/SectionHeading";
import { useTypedSelector } from "../store/hooks";

const Blog = () => {
  const posts = useTypedSelector((state) => state.catalog.posts);

  return (
    <>
      <SectionHeading
        eyebrow="Journal"
        title="Short-form guides made for quick departures"
        description="Grab a two-day itinerary or dig into a longer city loop with packing reminders."
      />
      <div className="grid posts">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Blog;
