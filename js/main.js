const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Propriétés de l'étoile
const star = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    mass: 5000
};

// Fonction pour créer une particule
function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.floor(Math.random() * (5-1)+1) + 1,
        mass: Math.floor(Math.random() * (5-1)+1) + 1,
        velocityX: 0,
        velocityY: 0,
        acceleration: Math.random() * 0.1 // Accélération due à la gravité
    };
}

// Propriétés de la particule
let particle = createParticle(); // Utiliser la fonction pour initialiser la particule

// Dessine l'étoile
function drawStar() {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

// Dessine la particule
function drawParticle() {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Fonction de mise à jour de la simulation
function update() {
    const dx = star.x - particle.x;
    const dy = star.y - particle.y;
    const distanceSquared = dx * dx + dy * dy;

    // Calcul de la force gravitationnelle (simplifié)
    const force = (star.mass * particle.mass) / distanceSquared;
    const forceX = (force * dx) / Math.sqrt(distanceSquared);
    const forceY = (force * dy) / Math.sqrt(distanceSquared);

    // Mettre à jour la vitesse de la particule
    particle.velocityX += forceX * particle.acceleration;
    particle.velocityY += forceY * particle.acceleration;

    // Mettre à jour la position de la particule
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

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

// Lancer à nouveau la simulation lorsque la barre d'espace est pressée
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        particle = createParticle(); // Réinitialiser la particule
    }
});
