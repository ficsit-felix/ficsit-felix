

export function getProperty(actor: ActorOrObject, propertyName: string): Property | undefined {
  if (actor.entity !== undefined) {
    if (actor.entity.properties !== undefined) {
      for (let i = 0; i < actor.entity.properties.length; i++) {
        const property = actor.entity.properties[i];
        if (property.name === propertyName) {
          return property;
        }
      }
    }
  }
  return undefined;
}

export function findActorByName(levelName: string, pathName: string): ActorOrObject | undefined {
  if (window.data !== undefined) {
    // TODO might be worth optimizing using hashmap or the like
    for (let i = 0; i < window.data.objects.length; i++) {
      const element = window.data.objects[i];
      if (element.pathName === pathName && // compare by pathName first as if they are the same, the levelName will very probably be the same, too.
          element.levelName === levelName) {
        return element;
      }
    }
  }
  return undefined;
}