/**
 * Verify Charlie's image paths in all configs
 */
import { getTeacherForClass } from '../constants/teacher-registry.ts';

console.log('🔍 Verificando rutas de Charlie en configs...\n');

const styles = [
  { id: 'afro-contemporaneo', key: 'afrocontemporaneo' },
  { id: 'hip-hop', key: 'hiphop' },
  { id: 'afrobeat', key: 'afro' },
  { id: 'hip-hop-reggaeton', key: 'hiphopReggaeton' },
  { id: 'reggaeton-cubano', key: 'reggaetonCubano' },
];

styles.forEach(style => {
  const teacher = getTeacherForClass('charlie-breezy', style.key);
  console.log(`📄 ${style.id}:`);
  console.log(`   image: ${teacher.image}`);
  console.log(`   srcSet: ${teacher.imageSrcSet?.substring(0, 80)}...`);
  console.log('');
});

console.log('✅ Si todas las rutas muestran "profesor-charlie-breezy", la configuración es correcta.');
console.log('❌ Si ves rutas diferentes, hay un problema en teacher-images.ts');
