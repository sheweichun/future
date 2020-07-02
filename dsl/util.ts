import * as immutable from 'immutable';
const {fromJS, is, Iterable} = immutable
//@ts-ignore
window['immutable'] = immutable;
export function compare(nextProfile:any, profile:any, ignorePath: boolean = true) {
  if (nextProfile && profile) {
    if (ignorePath) {
      return is(nextProfile, profile)
    } else {
      return is(nextProfile, profile) && nextProfile._keyPath.join('') === profile._keyPath.join('')
    }
  }
  return !nextProfile && !profile;
}
export function ensureIsImmutable(profile:any) {
  if (Iterable.isIterable(profile)) {
    return profile;
  } else {
    return fromJS(profile);
  }
}
export function isDescendant(target:any, child:any) {
  if (target._keyPath.length > child._keyPath.length) {
    return false;
  }
  let childPath = child._keyPath.join('');
  let targetPath = target._keyPath.join('');
  return childPath !== targetPath && childPath.indexOf(targetPath) === 0;
}
export function isImmutable(data: any) {
  return Iterable.isIterable(data);
}
export const isIndexed = Iterable.isIndexed;
export const isKeyed = Iterable.isKeyed;
export function setProp(props: any, key: string, value: any) {
  const cursor = getProp(props, key);
  if (cursor) {
    return cursor.set('value', value);
  }
}
export function getProp(props: any, key: string) {
  return props.find((v: any) => v && v.get('name') === key);
}