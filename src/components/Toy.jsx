function Toy({ toy, damage, repaired = false, variant }) {
  const imageKey = variant ?? (repaired ? "fixed" : damage);
  const image = toy.images[imageKey];

  return (
    <div className={`toy toy-${toy.id}`}>
      <img
        src={image}
        alt={`${toy.name}`}
        className="toyImage"
        draggable="false"
      />
    </div>
  );
}

export default Toy;
