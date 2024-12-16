// middleware/redirect.js
export default function ({ route, redirect }) {
  if (route.path.startsWith('/@')) {
    return redirect(`/channel${route.path}`); // スライスしない
  }
}