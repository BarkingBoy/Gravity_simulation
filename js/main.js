const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Propriétés de l'étoile
const star = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    z: 0, // Profondeur
    radius: 30,
    mass: 5000
};

// Point de départ des particules
let sourcePoint = { x: canvas.width / 2, y: canvas.height / 2 };
const particles = [];

// Fonction pour créer une particule avec coordonnée `z`
function createParticle() {
    return {
        x: sourcePoint.x,
        y: sourcePoint.y,
        z: Math.random() * 1000 + 100, // Distance initiale
        radius: 5,
        mass: 5,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        acceleration: 0.1
    };
}

// Distance focale (pour perspective)
const focalLength = 500;

// Fonction pour projeter les coordonnées 3D en 2D
function project3D(x, y, z) {
    const scale = focalLength / (focalLength + z);
    return {
        x: canvas.width / 2 + (x - canvas.width / 2) * scale,
        y: canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale: scale
    };
}

// Dessine l'étoile en 3D
function drawStar() {
    const projected = project3D(star.x, star.y, star.z);
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, star.radius * projected.scale, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

// Dessine une particule en 3D
function drawParticle(particle) {
    const projected = project3D(particle.x, particle.y, particle.z);
    const projectedRadius = particle.radius * projected.scale;

    // Dessine la particule uniquement si elle est visible
    if (projectedRadius > 0 && projected.scale > 0) {
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, projectedRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

// Mise à jour de toutes les particules
function updateParticles() {
    particles.forEach((particle, index) => {
        const dx = star.x - particle.x;
        const dy = star.y - particle.y;
        const dz = star.z - particle.z;
        const distanceSquared = dx * dx + dy * dy + dz * dz;

        // Calcul de la force gravitationnelle simplifiée
        const force = (star.mass * particle.mass) / distanceSquared;
        const distance = Math.sqrt(distanceSquared);
        const forceX = (force * dx) / distance;
        const forceY = (force * dy) / distance;
        const forceZ = (force * dz) / distance;

        // Mise à jour de la vitesse et de la position de la particule
        particle.velocityX += forceX * particle.acceleration;
        particle.velocityY += forceY * particle.acceleration;
        particle.velocityZ += forceZ * particle.acceleration;

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.z += particle.velocityZ;

        // Limite `z` pour éviter que les particules s'approchent trop de la caméra
        if (particle.z < 10) particle.z = 10;
    });
}

// Fonction principale de la simulation
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStar();
    particles.forEach(drawParticle);
    updateParticles();

    requestAnimationFrame(update);
}

// Initialiser la simulation
update();

// Générer une nouvelle source de particules avec clic
canvas.addEventListener('click', () => {
    particles.length = 0; // Réinitialise les anciennes particules
    sourcePoint = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    };
    particles.push(createParticle()); // Ajouter une nouvelle particule
});
