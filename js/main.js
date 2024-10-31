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

// Fonction pour créer une particule avec coordonnée `z` et une profondeur de vue
function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000 + 100, // Distance initiale entre 100 et 1100
        radius: 5,
        mass: 15,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0, // Vitesse sur l'axe z
        acceleration: 0.1
    };
}

// Propriétés de la particule
let particle = createParticle(); 

// Distance focale (détermine la profondeur de la perspective)
const focalLength = 500;

// Fonction pour projeter les coordonnées 3D en 2D
function project3D(x, y, z) {
    const scale = focalLength / (focalLength + z); 
    return {
        x: canvas.width / 2 + (x - canvas.width / 2) * scale,
        y: canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale: scale // Échelle pour ajuster la taille en fonction de `z`
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

// Dessine la particule en 3D
function drawParticle() {
    const projected = project3D(particle.x, particle.y, particle.z);
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, particle.radius * projected.scale, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Fonction de mise à jour de la simulation
function update() {
    if (particle.z < 10) particle.z = 10; // Profondeur minimale
    const dx = star.x - particle.x;
    const dy = star.y - particle.y;
    const dz = star.z - particle.z; // Calcul de la profondeur
    const distanceSquared = dx * dx + dy * dy + dz * dz;

    // Calcul de la force gravitationnelle (simplifié)
    const force = (star.mass * particle.mass) / distanceSquared;
    const distance = Math.sqrt(distanceSquared);
    const forceX = (force * dx) / distance;
    const forceY = (force * dy) / distance;
    const forceZ = (force * dz) / distance;

    // Mettre à jour la vitesse de la particule
    particle.velocityX += forceX * particle.acceleration;
    particle.velocityY += forceY * particle.acceleration;
    particle.velocityZ += forceZ * particle.acceleration;

    // Mettre à jour la position de la particule
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;
    particle.z += particle.velocityZ;
    console.log(particle.velocityX, particle.velocityY, particle.velocityZ);
    

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redessiner l'étoile et la particule
    drawStar();
    drawParticle();

    // Appeler la fonction de mise à jour de manière répétée
    requestAnimationFrame(update);
}

// Démarrer la simulation
update();

// Réinitialiser la particule lorsque la barre d'espace est pressée
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        particle = createParticle(); // Réinitialiser la particule
    }
});
