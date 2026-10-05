/* Datos de demostración, tomados del prototipo original. Solo cambian los
   íconos (ahora son nombres del juego de íconos de arte.js) y las paletas
   de los mapas (ahora son las de Kapi). */
'use strict';
/* ============ DATOS DE DEMOSTRACIÓN ============
   Todo lo que ve la app sale de estas estructuras. Para sumar un grado, un mundo o un módulo
   se agregan datos: no hace falta tocar las pantallas. Contenido ficticio, a validar por el equipo. */

const AREAS = { mat:'Matemática', len:'Lengua', cn:'Ciencias Naturales', cs:'Ciencias Sociales', ed:'Educación Digital' };
const GRADES = [1,2,3,4,5,6];
const ordinal = g => g + '.º';

/* ---------- Mundos (uno por grado) ---------- */
const WORLDS = {
  1:{ id:'kapi', ready:true, name:'El Mundo de Kapi', place:'Esteros del Iberá', layout:'estero', avatar:'kapi', rizos:[[420,452],[545,500],[470,410]],
      mission:'Ayudá a Kapi a recorrer el monte y el estero. Cada aventura despeja un camino nuevo.',
      palette:{sky:'#fbf3df',sun:'#efbb3f',hill1:'#c9d8a8',hill2:'#a9c187',monte:'#84ad63',water:'#8fc4c4',waterLuz:'#cbe6e2',sand:'#e6d3ae'},
      nodes:[
        {id:'n1',guia:'arandu',mod:'frutos',x:215,y:498,zone:'El monte',icon:'guacamayo',requires:[]},
        {id:'n2',guia:'yvoty',mod:'historia',x:178,y:186,zone:'El estero',icon:'hoja',requires:['frutos']},
        {id:'n3',guia:'ita',mod:'esteros',x:503,y:332,zone:'La laguna',icon:'yacare',requires:['historia']},
        {id:'n4',mod:'lugar',x:668,y:213,zone:'La comunidad',icon:'casa',requires:['esteros']},
        {id:'n5',guia:'jasy',soon:true,x:802,y:529,zone:'Los senderos',icon:'brote',title:'El sendero de los pasos',blurb:'Un camino que se está construyendo.',requires:['lugar']}
      ],
      edges:[['n1','n2'],['n2','n3'],['n3','n4'],['n4','n5']],
      scenery:[
        {t:'cloud',a:[180,90,1,0]},{t:'cloud',a:[520,60,.8,20]},{t:'cloud',a:[820,130,1.1,40]},
        {t:'tree',a:[52,520,1.3]},{t:'tree',a:[95,420,1.5,true]},{t:'tree',a:[235,545,1.1]},{t:'tree',a:[240,405,.9]},{t:'tree',a:[30,360,1]},
        {t:'reed',a:[300,468,1]},{t:'reed',a:[430,590,1.1]},{t:'reed',a:[770,560,1]},
        {t:'camalote',a:[400,505,1]},{t:'camalote',a:[480,535,.8]},{t:'camalote',a:[610,565,1]},{t:'camalote',a:[660,505,.9]},
        {t:'palm',a:[820,395,1.2]},{t:'palm',a:[935,380,1]},{t:'palm',a:[880,560,1.1]},
        {t:'house',a:[690,350,1]},{t:'house',a:[810,335,.8]},
        {t:'guaca',a:[88,318,.8],after:'frutos'},
        {t:'yaca',a:[590,470,.9],after:'historia'},
        {t:'fish',a:[410,545,1],after:'historia'},
        {t:'house',a:[690,350,1,true],after:'esteros'},{t:'flower',a:[470,520,1],after:'esteros'},{t:'flower',a:[640,545,1],after:'esteros'}
      ]},
  2:{ id:'aguara', ready:true, name:'El Río de Tataendy', place:'Costa del Paraná', layout:'rio', avatar:'guacamayo', rizos:[[150,585],[380,620],[560,560],[300,545]],
      mission:'Tataendy necesita llevar una carta hasta la feria. Hay dos caminos para llegar: ¡podés elegir por dónde ir!',
      palette:{sky:'#fbf3df',sun:'#f0b36b',hill1:'#c9d8a8',hill2:'#a9c187',monte:'#84ad63',water:'#8fc4c4',waterLuz:'#cbe6e2',sand:'#e6d3ae'},
      nodes:[
        {id:'m1',mod:'puerto',x:114,y:350,zone:'El puerto',icon:'lancha',requires:[]},
        {id:'m2',mod:'carta',x:273,y:232,zone:'El correo',icon:'carta',requires:['puerto']},
        {id:'m3',mod:'peces',x:409,y:350,zone:'El río',icon:'pez',requires:['puerto']},
        {id:'m4',mod:'feria',x:859,y:105,zone:'La feria',icon:'feria',requires:['carta','peces']},
        {id:'m5',soon:true,x:938,y:418,zone:'La isla',icon:'isla',title:'Cuentos de la orilla',blurb:'Un camino que se está construyendo.',requires:['feria']}
      ],
      edges:[['m1','m2'],['m1','m3'],['m2','m4'],['m3','m4'],['m4','m5']],
      scenery:[
        {t:'cloud',a:[300,80,1,10]},{t:'cloud',a:[640,54,.85,30]},{t:'cloud',a:[900,120,1,55]},
        {t:'tree',a:[80,330,1.1]},{t:'tree',a:[610,300,1]},{t:'tree',a:[905,285,1.2]},{t:'tree',a:[460,318,.9]},
        {t:'palm',a:[250,548,1.1]},{t:'palm',a:[790,540,1.2]},{t:'palm',a:[420,580,.9]},
        {t:'camalote',a:[300,470,.9]},{t:'camalote',a:[690,470,1]},{t:'camalote',a:[560,505,.8]},
        {t:'house',a:[86,388,.9]},{t:'house',a:[655,206,.9]},
        {t:'boat',a:[-40,388,.9]},
        {t:'kapi',a:[215,300,.75],after:'puerto'},
        {t:'fish',a:[620,455,1],after:'peces'},{t:'fish',a:[350,488,.8],after:'peces'},
        {t:'house',a:[655,206,.9,true],after:'feria'},{t:'flower',a:[840,340,1],after:'feria'},{t:'flower',a:[870,352,1],after:'feria'}
      ]}
};
[3,4,5,6].forEach(g=>{ WORLDS[g] = { ready:false, id:'g'+g, name:'Universo del '+ordinal(g)+' grado' }; });

/* ---------- Currículo de demostración (para navegar en PROFUNDIZAR) ---------- */
const CURR = {
  1:{
    mat:{eje:[{id:'num',name:'Número y operaciones',cont:[
      {id:'com-col',name:'Comparación de colecciones',mods:['frutos']},
      {id:'conteo',name:'Conteo y reconocimiento de cantidades pequeñas',mods:['frutos']},
      {id:'corr',name:'Correspondencia término a término',mods:['frutos']}]},
      {id:'esp',name:'Espacio y medida',cont:[{id:'ubic',name:'Ubicación y recorridos en el espacio',mods:[]}]}]},
    len:{eje:[{id:'lect',name:'Lectura',cont:[
      {id:'hist',name:'Lectura de historias y secuencia narrativa',mods:['historia']},
      {id:'cart',name:'Lectura de carteles y textos del entorno',mods:['lugar']}]},
      {id:'esc',name:'Escritura',cont:[{id:'pal',name:'Escritura de palabras y frases breves',mods:[]}]},
      {id:'oral',name:'Oralidad',cont:[{id:'narr',name:'Escucha y narración de relatos',mods:['historia']}]}]},
    cn:{eje:[{id:'seres',name:'Seres vivos',cont:[{id:'anim',name:'Animales y ambientes donde viven',mods:['esteros']}]}]},
    cs:{eje:[{id:'com',name:'Comunidad y territorio',cont:[{id:'lug',name:'Lugares y trabajos de la comunidad',mods:['lugar']}]}]},
    ed:{eje:[{id:'pri',name:'Primeros pasos digitales',cont:[{id:'pant',name:'Uso de la pantalla táctil',mods:[]}]}]}
  },
  2:{
    mat:{eje:[{id:'num',name:'Número y operaciones',cont:[
      {id:'comp',name:'Composición de números hasta 20',mods:['puerto']},
      {id:'mon',name:'Sistema monetario: precios y pagos',mods:['feria']}]},
      {id:'med',name:'Medida',cont:[{id:'long',name:'Comparación de longitudes',mods:[]}]}]},
    len:{eje:[{id:'esc',name:'Escritura',cont:[{id:'carta',name:'Escritura de cartas y mensajes',mods:['carta']}]},
      {id:'lect',name:'Lectura',cont:[{id:'cuento',name:'Lectura de cuentos y poesías',mods:[]}]}]},
    cn:{eje:[{id:'seres',name:'Seres vivos',cont:[{id:'peces',name:'Animales del río: peces y aves',mods:['peces']}]}]},
    cs:{eje:[{id:'ofi',name:'Trabajos y oficios',cont:[{id:'feria',name:'La feria y los oficios de la costa',mods:['feria']}]}]},
    ed:{eje:[{id:'cuid',name:'Hábitos y cuidado',cont:[{id:'disp',name:'Cuidado del dispositivo y de los datos',mods:[]}]}]}
  }
};

/* ---------- Módulos ---------- */
const MODS = {
 frutos:{ id:'frutos', grade:1, area:'mat', eje:'Número y operaciones', cont:['Comparación de colecciones','Conteo y reconocimiento de cantidades pequeñas','Correspondencia término a término'],
  title:'Los frutos del monte', icon:'guacamayo', blurb:'Una aventura para descubrir cantidades.', duration:'15–20 min', buddy:'guaca', scene:'monte',
  reward:{icon:'pluma',name:'Pluma del guacamayo'},
  activity:'El guacamayo y los frutos',
  kw:'comparación de colecciones comparar colecciones cantidades conteo contar más menos igual correspondencia uno a uno término a término dado guacamayo frutos cantidades pequeñas registro',
  stations:[
    {type:'f-dado',title:'El dado del guacamayo',aim:'Producir una colección con tantos elementos como puntos muestra el dado; reconocer cantidades pequeñas.'},
    {type:'f-comparar',title:'¿Quién tiene más?',aim:'Comparar dos colecciones (más, menos, igual); apoyarse en la correspondencia si hace falta.'},
    {type:'f-pichones',title:'Un fruto para cada pichón',aim:'Establecer correspondencia término a término y decidir si sobran o faltan elementos.'},
    {type:'f-gemela',title:'La cesta gemela',aim:'Construir una colección equivalente a otra dada, sin usar números escritos.'},
    {type:'f-cuaderno',title:'El cuaderno de piedritas',aim:'Registrar una cantidad con marcas propias (piedritas, palitos, puntitos).'}],
  sheet:{
   proposito:'Que los niños produzcan, comparen y registren colecciones de hasta 6 elementos usando procedimientos propios (percepción global, conteo, correspondencia), sin que la escritura numérica sea una condición para participar.',
   situacion:'El guacamayo Tataendy tira un dado. Según los puntos que salen, caen frutos del árbol. A lo largo de cinco estaciones los niños llenan cestas, comparan lo que tienen el guacamayo y Kapi, reparten un fruto a cada pichón, arman una cesta “gemela” y anotan cuántos frutos hay con marcas que eligen ellos.',
   aprendizajes:['Producir colecciones con una cantidad dada (hasta 6).','Comparar colecciones y decir cuál tiene más, cuál menos o si tienen la misma cantidad.','Usar la correspondencia uno a uno para verificar o comparar.','Contar colecciones pequeñas coordinando gesto y palabra.','Registrar cantidades mediante marcas propias.'],
   previos:['Contar oralmente algunos números de la serie.','Nociones cotidianas de “muchos”, “pocos”, “más”, “menos”.'],
   curriculo:{ref:'Matemática · Número y operaciones', nota:'Referencia de demostración. El equipo de contenidos completa y valida la relación con el diseño curricular provincial.'},
   esperables:['Reconocer de un vistazo las cantidades 1 a 3 (subitizing) en el dado.','Contar de a uno señalando cada fruto.','Poner un fruto por cada punto del dado.','Alinear los elementos de dos colecciones para compararlas.'],
   posibles:['Contar sin coordinar gesto y palabra y perder la cuenta.','Usar los dedos para “guardar” la cantidad.','Dibujar o marcar una raya por fruto.','Recontar hasta obtener el mismo resultado.'],
   estrategias:['Correspondencia: “uno para cada uno”.','Conteo de una colección y armado de otra con el mismo número.','Estimación global en colecciones muy chicas, con verificación.'],
   anticipaciones:['Es probable que algunos niños digan “hay más” porque la colección ocupa más lugar, no porque tenga más elementos.','Con la colección dispersa, más niños van a necesitar alinear para comparar.','Al final del recorrido varios van a preferir las piedritas y otros los palitos: ambas son válidas.'],
   errores:[
    {e:'Cuentan dos veces el mismo fruto o se saltean alguno.',q:'Proponer separar los frutos ya contados, o pasarlos de a uno a otra cesta.'},
    {e:'Dicen que “hay más” en la colección que ocupa más lugar.',q:'Pedir que pongan los elementos en fila, uno debajo del otro, y que expliquen qué ven.'},
    {e:'Dan por “igual” colecciones que se parecen.',q:'Preguntar “¿cómo podemos estar seguros?” y habilitar el apareamiento.'},
    {e:'Pueden decir “cuatro” pero no armar la colección de cuatro.',q:'Volver a contar a medida que arman; que digan el número al poner cada fruto.'}],
   variables:[
    {v:'Cantidad de elementos',d:'De 1 a 3 (reconocimiento global) → 4 a 6 (conteo) → más de 6 (fuera de esta versión).'},
    {v:'Disposición espacial',d:'Elementos dispersos o alineados. Dispersos exigen más un procedimiento para comparar.'},
    {v:'Diferencia entre colecciones',d:'Diferencia grande (5 y 2) o de uno (4 y 5). La diferencia de uno es más exigente.'},
    {v:'Apoyo de la correspondencia',d:'Con o sin la opción “ponerlos en fila”. Se puede ocultar para observar qué procedimiento surge.'},
    {v:'Tipo de registro',d:'Piedritas, palitos o puntitos; más adelante, numerales.'}],
   intervenciones:['“¿Cómo te diste cuenta?”','“¿Cómo podemos saber si tienen la misma cantidad?”','“¿Hay otra manera de averiguarlo?”','Evitar decir cuál es la respuesta correcta: devolver la pregunta y dejar que verifiquen.','Registrar por escrito, en una lista de clase, los procedimientos que fueron apareciendo.'],
   recursos:['Frutos reales o semillas (pitangas, ñangapirí, piedritas) y cestas o vasos.','Dado de puntos y tapitas para trabajar en el aula sin pantalla.','Lámina para armar “cestas gemelas” (imprimible).','Modo aula: proyectar una estación para trabajar en conjunto.']
  },
  card:{
   consigna:'Busquen en casa dos grupos de objetos y conversen sobre cuál tiene más, cuál tiene menos o si tienen la misma cantidad.',
   tiempo:'10 minutos', con:'Alguien que acompañe (o hermanos, primos, amigos)', materiales:'Objetos que haya en casa: cucharas, tapitas, semillas, frutas…',
   preguntas:['¿Cuál tiene más?','¿Cómo podemos saberlo?','¿Podemos armar otro grupo que tenga tantos como este?'],
   orientacion:'No es necesario decirle al niño cómo resolverlo. Podés preguntarle cómo se dio cuenta y permitir que utilice la estrategia que prefiera.',
   mas:'Si quieren seguir: cambien los objetos de lugar (juntos, separados, en fila) y vean si cambia la respuesta.',
   aula:'Si quiere, puede contar en la escuela cómo lo resolvieron: con objetos, con un dibujo o con palabras.',
   adapt:['Si hay poco tiempo: comparen una sola vez mientras preparan la mesa.','Si no hay objetos: usen los dedos de las manos, los pasos hasta la puerta o las piedras de la vereda.'],
   voz:'Llevate esta misión a casa: buscá dos grupos de cosas y averiguá, con alguien que te acompañe, cuál tiene más.'
  }},

 historia:{ id:'historia', grade:1, area:'len', eje:'Lectura', cont:['Lectura de historias y secuencia narrativa','Escucha y narración de relatos'],
  title:'Una historia en el estero', icon:'hoja', blurb:'Una aventura para ordenar y escuchar una historia.', duration:'10–15 min', buddy:'kapi', scene:'estero',
  reward:{icon:'huella',name:'Huella de yacaré'}, activity:'La historia de Kapi y el yacaré',
  kw:'lectura historia cuento secuencia narrativa ordenar escenas comprender leer palabras imágenes escucha narración oral estero',
  stations:[
    {type:'ordenar',title:'¿Qué pasó primero?',aim:'Ordenar tres escenas de una historia respetando la secuencia.',
      intro:'Kapi vivió una historia en el estero. ¡Ayudame a ponerla en orden! Tocá lo que pasó primero.',
      ok:'¡Así fue la historia! Empezó, pasó algo y terminó.',hint:'Pensá: ¿qué pasó antes? Mirá bien las imágenes.',
      items:[{em:'amanecer',t:'Kapi se despierta en el estero.'},{em:'yacare-camalotes',t:'Aparece un yacaré entre los camalotes.'},{em:'kapi-yacare',t:'Kapi y el yacaré toman sol juntos.'}],order:[2,0,1]},
    {type:'elegir',title:'¿Qué dice acá?',aim:'Relacionar una palabra escrita con una imagen usando pistas (letra inicial, longitud).',
      intro:'Mirá el dibujo. ¿Cuál de estas palabras dice CAMALOTE? Fijate con qué letra empieza.',
      ok:'¡Muy bien! CAMALOTE empieza con C.',hint:'Buscá la palabra que empiece con la misma letra que CAMINO y CASA.',
      media:'flor-camalote',options:['ESTERO','CAMALOTE','KAPI'],answer:1}],
  sheet:{
   proposito:'Que los niños sigan el hilo de un relato breve y reconstruyan su secuencia apoyándose en imágenes y en la escucha, y que comiencen a relacionar palabras escritas con imágenes.',
   situacion:'Los niños ordenan tres escenas de una historia de Kapi con voz en off y luego eligen la palabra escrita que corresponde a una imagen.',
   aprendizajes:['Reconstruir la secuencia de un relato (inicio, nudo, cierre).','Anticipar y verificar el sentido usando imágenes.','Localizar una palabra conocida por su letra inicial.'],
   previos:['Escuchar cuentos y relatos breves.','Reconocer algunas letras (las de su nombre).'],
   curriculo:{ref:'Lengua · Lectura y Oralidad',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Ordenar las escenas por el sentido de la historia.','Justificar oralmente el orden elegido.'],
   posibles:['Ordenar por “lo que más me gusta” o por lo que se ve primero.','Reconstruir la historia sin mirar el orden de las viñetas.'],
   estrategias:['Volver a escuchar la voz en off antes de decidir.','Comparar dos viñetas y decidir cuál va antes.'],
   anticipaciones:['Algunos niños van a cambiar el orden al oír de nuevo el relato: es una buena oportunidad para conversar.'],
   errores:[{e:'Ordenan según el tamaño o la belleza de la imagen.',q:'Volver al relato: “¿qué pasa después de que Kapi se despierta?”.'},{e:'Eligen una palabra al azar.',q:'Pedir que busquen la letra con la que empieza y que la comparen con otras palabras que conocen.'}],
   variables:[{v:'Cantidad de escenas',d:'3 (esta versión), 4 o 5 en versiones posteriores.'},{v:'Apoyo de la voz',d:'Con lectura en voz alta o solo con imágenes.'}],
   intervenciones:['“¿Cómo sabés que eso pasó primero?”','Leer en voz alta el texto de cada escena y dejar que los niños reconstruyan.'],
   recursos:['Viñetas imprimibles para armar la historia en el aula.','Audio del relato para escuchar en grupo.']},
  card:{consigna:'Contá una historia en tres momentos: cómo empieza, qué pasa y cómo termina. Puede ser inventada o de algo que les pasó.',
   tiempo:'10 minutos',con:'Alguien que acompañe, o toda la mesa',materiales:'Nada. Si quieren, papel y lápiz para dibujar los tres momentos.',
   preguntas:['¿Cómo empezó?','¿Qué pasó después?','¿Cómo terminó? ¿Podría haber terminado de otra manera?'],
   orientacion:'Dejá que el niño elija la historia y el ritmo. Si duda, preguntá “¿y después?”. No hace falta corregir cómo lo cuenta.',
   mas:'Si quieren seguir: dibujen los tres momentos y ordénenlos de otra forma para ver cómo cambia la historia.',
   aula:'Puede contar en la escuela su historia o mostrar el dibujo.',
   adapt:['Si hay poco tiempo: cuenten solo el comienzo y dejen el final para otro día.','Pueden contarla en la lengua que se hable en casa, incluido el guaraní.'],
   voz:'Llevate esta misión a casa: contale a alguien una historia con principio, medio y final.'}},

 esteros:{ id:'esteros', grade:1, area:'cn', eje:'Seres vivos', cont:['Animales y ambientes donde viven'],
  title:'Entre los esteros', icon:'yacare', blurb:'Una aventura para descubrir quién vive dónde.', duration:'10–15 min', buddy:'yaca', scene:'estero',
  reward:{icon:'flor',name:'Flor de camalote'}, activity:'¿Dónde vive cada animal?',
  kw:'ciencias naturales animales ambientes agua tierra clasificar seres vivos esteros habitat observar',
  stations:[
    {type:'clasificar',title:'¿Dónde vive?',aim:'Clasificar animales según el ambiente donde viven.',
      intro:'En los esteros viven muchísimos animales. Llevá cada uno a su lugar: ¿en el agua o en el monte?',
      ok:'¡Cada animal en su lugar! Algunos viven en el agua y otros entre los árboles.',hint:'Pensá: ¿dónde lo viste alguna vez? ¿Nada, vuela o camina?',
      bins:[{id:'agua',label:'En el agua',em:'agua'},{id:'monte',label:'En el monte',em:'arbol'}],
      items:[{em:'sabalo',n:'Sábalo',b:'agua'},{em:'guacamayo',n:'Guacamayo',b:'monte'},{em:'tortuga',n:'Tortuga',b:'agua'},{em:'caraya',n:'Carayá',b:'monte'},{em:'siriri',n:'Pato sirirí',b:'agua'},{em:'yaguarete',n:'Yaguareté',b:'monte'}]},
    {type:'elegir',title:'¿Quién es?',aim:'Relacionar una característica con el animal que la tiene.',
      intro:'Adiviná: tiene pico grande y colores, y vive en los árboles. ¿Quién es?',
      ok:'¡El guacamayo! Sus plumas de colores se ven desde lejos.',hint:'Pensá en un animal que vuela y vive en los árboles.',
      media:'duda',options:['Sábalo','Guacamayo','Tortuga'],answer:1}],
  sheet:{
   proposito:'Que los niños reconozcan que distintos animales viven en distintos ambientes y comiencen a relacionar características con el lugar donde viven.',
   situacion:'Los niños clasifican animales del Iberá según vivan en el agua o en el monte y resuelven una adivinanza a partir de una característica.',
   aprendizajes:['Reconocer animales de la región.','Relacionar un animal con el ambiente donde vive.','Justificar una clasificación con una razón.'],
   previos:['Nombrar algunos animales conocidos.','Distinguir agua y tierra en el entorno.'],
   curriculo:{ref:'Ciencias Naturales · Seres vivos',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Clasificar por “lo que hace” (nada, vuela).','Explicar la clasificación con una razón simple.'],
   posibles:['Clasificar por el color o el tamaño.','Dudar con animales que pasan tiempo en dos ambientes.'],
   estrategias:['Contrastar con lo que se observa en salidas al patio o al estero cercano.'],
   anticipaciones:['El pato puede generar dudas (agua y tierra): se recomienda abrir la conversación.'],
   errores:[{e:'Clasifican por el color o por el tamaño.',q:'Preguntar “¿dónde lo viste? ¿qué hace ese animal todo el día?”.'},{e:'Creen que un animal solo puede vivir en un lugar.',q:'Mostrar casos de animales que usan más de un ambiente.'}],
   variables:[{v:'Cantidad de categorías',d:'2 (agua/monte) → 3 (agua/tierra/aire).'},{v:'Cercanía de las imágenes',d:'Fotos reales o ilustraciones.'}],
   intervenciones:['“¿Cómo sabés que vive ahí?”','Proponer una salida de observación y comparar con lo que vieron.'],
   recursos:['Fotografías de animales del Iberá.','Lámina de dos ambientes para clasificar en el aula.']},
  card:{consigna:'Salgan a mirar el patio, la vereda o la plaza: ¿qué animales pueden encontrar? Conversen sobre dónde viven y qué hacen.',
   tiempo:'10 a 15 minutos',con:'Alguien que acompañe',materiales:'Nada. Si quieren, papel y lápiz para anotar lo que vean.',
   preguntas:['¿Qué animales vimos?','¿Dónde estaban? ¿Qué hacían?','¿Dónde creés que vive cuando no lo vemos?'],
   orientacion:'No hace falta saber el nombre de todos los animales. Podés decir “no sé, ¿cómo podemos averiguarlo?” y buscar juntos.',
   mas:'Si quieren seguir: hagan un dibujo del lugar donde vive uno de los animales que observaron.',
   aula:'Puede contar a sus compañeros qué animales encontró.',
   adapt:['Si no pueden salir: miren por la ventana o busquen animales en libros o fotos.','Pueden nombrar a los animales en guaraní si la familia lo habla.'],
   voz:'Llevate esta misión a casa: salí a mirar qué animales viven cerca tuyo.'}},

 lugar:{ id:'lugar', grade:1, area:'len', eje:'Lectura', cont:['Lectura de carteles y textos del entorno','Lugares y trabajos de la comunidad'],
  title:'Historias de nuestro lugar', icon:'casa', blurb:'Una aventura para leer los carteles de la comunidad.', duration:'10–15 min', buddy:'kapi', scene:'estero',
  reward:{icon:'cesta',name:'Cesta de la feria'}, activity:'Los carteles de la comunidad',
  kw:'carteles textos del entorno lectura palabras comunidad lugares escuela almacén leer unir relacionar imagen palabra',
  stations:[
    {type:'unir',title:'Uní cada lugar con su cartel',aim:'Relacionar imágenes de lugares con carteles escritos usando pistas.',
      intro:'En la comunidad hay muchos carteles. Uní cada lugar con lo que dice su cartel. Tocá uno y después el otro.',
      ok:'¡Todos los carteles en su lugar!',hint:'Fijate con qué letra empieza cada cartel.',
      pairs:[{a:'escuela',b:'ESCUELA'},{a:'almacen',b:'ALMACÉN'},{a:'plaza',b:'PLAZA'}]},
    {type:'elegir',title:'¿Cuál es el cartel de la escuela?',aim:'Identificar una palabra conocida entre otras.',
      intro:'Ahora buscá el cartel que dice ESCUELA. ¿Cuál es?',
      ok:'¡Ese es! Empieza con E, como ESCUELA.',hint:'ESCUELA empieza con E y es una palabra larga.',
      media:'escuela',options:['PLAZA','ESCUELA','ALMACÉN'],answer:1}],
  sheet:{
   proposito:'Que los niños comiencen a leer palabras que circulan en su entorno (carteles, envases, nombres de lugares) apoyándose en imágenes y en indicios del texto.',
   situacion:'Los niños unen lugares con sus carteles y luego identifican una palabra entre varias.',
   aprendizajes:['Identificar palabras del entorno usando pistas (letra inicial, longitud).','Relacionar imagen y texto.','Reconocer que los carteles “dicen” algo.'],
   previos:['Reconocer las letras de su nombre.','Conocer lugares de la comunidad.'],
   curriculo:{ref:'Lengua · Lectura · Ciencias Sociales · Comunidad y territorio',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Anticipar lo que dice un cartel por el lugar.','Verificar con la letra inicial.'],
   posibles:['Reconocer la palabra “de memoria” por su forma.','Leer letra por letra.'],
   estrategias:['Anticipar → verificar con indicios del texto.'],
   anticipaciones:['Algunos niños van a reconocer ESCUELA de memoria; otros van a necesitar mirar cada letra.'],
   errores:[{e:'Eligen por el largo sin mirar las letras.',q:'Proponer comparar dos palabras del mismo largo.'},{e:'Leen “lo que debería decir” sin mirar.',q:'Preguntar “¿qué letras ves? ¿cuáles dicen eso?”.'}],
   variables:[{v:'Cantidad de opciones',d:'2 o 3 palabras.'},{v:'Similitud entre palabras',d:'Palabras con la misma letra inicial (más difícil).'}],
   intervenciones:['“¿Cómo sabés que dice eso?”','Aportar una pista sin dar la respuesta.'],
   recursos:['Fotografías de carteles de la comunidad.','Lámina para armar el mapa del barrio.']},
  card:{consigna:'Busquen juntos un cartel, envase, libro o mensaje y conversen sobre qué creen que dice y cómo pueden averiguarlo.',
   tiempo:'10 minutos',con:'Alguien que acompañe',materiales:'Un cartel, un envase o un libro que haya en casa o en la calle.',
   preguntas:['¿Qué creés que dice? ¿Por qué?','¿Cómo podemos averiguarlo?','¿Conocés alguna letra que esté ahí?'],
   orientacion:'No hace falta que el niño lea de corrido. Alcanza con que se anime a pensar qué dice y a buscar pistas en las letras y las imágenes.',
   mas:'Si quieren seguir: busquen otro cartel que empiece con la misma letra del nombre del niño.',
   aula:'Puede traer un envase o dibujar un cartel para compartir en el aula.',
   adapt:['Si hay poco tiempo: elijan un solo envase de la cocina.','Si hay carteles en guaraní, también sirven.'],
   voz:'Llevate esta misión a casa: buscá un cartel y averiguá qué dice.'}},

 puerto:{ id:'puerto', grade:2, area:'mat', eje:'Número y operaciones', cont:['Composición de números hasta 20'],
  title:'El puerto de las lanchas', icon:'lancha', blurb:'Una misión para completar la lancha antes de zarpar.', duration:'15 min', buddy:'guaca', scene:'rio',
  reward:{icon:'ancla',name:'Ancla de bronce'}, activity:'Completá la lancha',
  kw:'composición de números completar 10 sumas restas cálculo mental hasta 20 pasajeros lancha complementos cuánto falta',
  stations:[
    {type:'componer',title:'Completá la lancha',aim:'Encontrar cuántos faltan para completar 10.',
      intro:'La lancha lleva diez pasajeros. Ya subieron algunos. ¡Subí a los que faltan!',ok:'¡Lancha completa! Ahora contame cuántos subieron.',hint:'Fijate cuántos asientos vacíos quedan.',
      cap:10,init:6,ask:'¿Cuántos pasajeros subieron ahora?',opts:[3,4,5],ans:4},
    {type:'componer',title:'La lancha grande',aim:'Encontrar cuántos faltan para completar 12.',
      intro:'Esta lancha es más grande: lleva doce. Ya hay siete. ¿Cuántos faltan?',ok:'¡Completa! Zarpamos.',hint:'Contá los asientos vacíos.',
      cap:12,init:7,ask:'¿Cuántos subieron ahora?',opts:[4,5,6],ans:5}],
  sheet:{
   proposito:'Que los niños encuentren complementos a 10 y a 12 mediante procedimientos propios (conteo, sobreconteo, cálculos conocidos) en una situación de completar.',
   situacion:'Los niños completan una lancha con capacidad fija, sabiendo cuántos pasajeros ya subieron, y luego dicen cuántos subieron.',
   aprendizajes:['Determinar cuántos faltan para completar una cantidad.','Utilizar resultados conocidos (complementos de 10).','Pasar de la acción (subir pasajeros) a la respuesta numérica.'],
   previos:['Contar hasta 20.','Escribir y reconocer numerales hasta 20.'],
   curriculo:{ref:'Matemática · Número y operaciones',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Contar los asientos vacíos.','Sobrecontar desde 6 hasta 10.'],
   posibles:['Usar dedos.','Recordar que 6 + 4 = 10.','Restar 10 – 6.'],
   estrategias:['Contar hacia adelante desde el número dado.','Usar la descomposición de 10.'],
   anticipaciones:['Algunos niños dicen “ocho” (el número al que llegan) en vez de “cuatro” (los que subieron).'],
   errores:[{e:'Responden con el total (10) y no con los que subieron.',q:'Volver a la escena: “¿cuántos estaban? ¿cuántos suben ahora?”.'},{e:'Cuentan el 6 dos veces.',q:'Proponer que digan el número mientras suben cada pasajero.'}],
   variables:[{v:'Capacidad de la lancha',d:'10 → 12 → 20.'},{v:'Cantidad inicial',d:'Con o sin pasajeros ya arriba.'},{v:'Representación',d:'Con asientos visibles o solo con el número.'}],
   intervenciones:['“¿Cómo hiciste para saber?”','Comparar dos procedimientos distintos frente al grupo.'],
   recursos:['Tarjetas de pasajeros y lancha imprimible.','Cinta numérica.']},
  card:{consigna:'Armen grupos de 10 con lo que tengan: tapitas, semillas, cucharas… Si ya tienen 6, ¿cuántas faltan para llegar a 10?',
   tiempo:'10 minutos',con:'Alguien que acompañe',materiales:'Tapitas, semillas, piedritas o botones.',
   preguntas:['¿Cuántas ya tenemos?','¿Cuántas faltan para 10? ¿Cómo lo pensaste?','¿Hay otra forma de llegar a 10?'],
   orientacion:'Dejá que cuente como quiera: con los dedos, con los objetos o de memoria. Lo importante es que cuente cómo lo pensó.',
   mas:'Si quieren seguir: prueben con 12 o con 8.',aula:'Puede mostrar cómo lo resolvió a sus compañeros.',
   adapt:['Si hay poco tiempo: jueguen una sola ronda mientras esperan la comida.','Si no tienen objetos: usen los dedos de dos personas.'],
   voz:'Llevate esta misión a casa: armá grupos de diez cosas.'}},

 carta:{ id:'carta', grade:2, area:'len', eje:'Escritura', cont:['Escritura de cartas y mensajes'],
  title:'La carta del botero', icon:'carta', blurb:'Una misión para armar una carta y llevarla a destino.', duration:'15 min', buddy:'guaca', scene:'rio',
  reward:{icon:'sello',name:'Sello del correo'}, activity:'Armá la carta',
  kw:'carta mensaje escritura partes de una carta saludo despedida destinatario producción de textos correo',
  stations:[
    {type:'ordenar',title:'Las partes de la carta',aim:'Reconocer y ordenar las partes de una carta (saludo, mensaje, despedida).',
      intro:'El botero le escribió una carta a Kapi, pero se le desordenó. ¡Ordenala para que pueda leerla!',ok:'¡Ahora se entiende! Toda carta empieza con un saludo y termina con una despedida.',hint:'¿Cómo empieza una carta? ¿Cómo termina?',
      items:[{em:'saludo',t:'Querido Kapi:'},{em:'invitacion',t:'Te invito a la fiesta del río.'},{em:'abrazo',t:'Un abrazo, Tataendy.'}],order:[1,2,0]},
    {type:'elegir',title:'¿Para qué sirve la firma?',aim:'Comprender la función de la firma en una carta.',
      intro:'Al final de la carta hay un nombre. ¿Para qué está?',ok:'¡Claro! Así se sabe quién la escribió.',hint:'Pensá: ¿cómo sabe Kapi quién le mandó la carta?',
      media:'firma',options:['Para decorar','Para saber quién la escribió','Para que sea larga'],answer:1}],
  sheet:{
   proposito:'Que los niños reconozcan la estructura de una carta y sus partes, y comiencen a producir mensajes con destinatario y propósito claros.',
   situacion:'Los niños ordenan las partes de una carta y reflexionan sobre la función de la firma.',
   aprendizajes:['Reconocer partes de una carta.','Escribir mensajes para un destinatario.','Usar fórmulas de inicio y cierre.'],
   previos:['Escribir palabras y frases con ayuda.','Conocer la función social de escribir mensajes.'],
   curriculo:{ref:'Lengua · Escritura',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Ordenar por sentido comunicativo.','Reconocer el saludo y la despedida.'],
   posibles:['Escribir el saludo con ayuda de un modelo.'],
   estrategias:['Comparar con cartas reales del aula.'],
   anticipaciones:['Varios niños van a querer escribir sus propias cartas: se recomienda un buzón del aula.'],
   errores:[{e:'Ponen la despedida primero.',q:'Leer en voz alta y preguntar si “se entiende”.'},{e:'Escriben sin destinatario.',q:'“¿Para quién es? ¿Cómo lo va a saber?”.'}],
   variables:[{v:'Cantidad de partes',d:'3 → 5 (fecha, lugar, saludo, cuerpo, despedida).'},{v:'Destinatario',d:'Conocido o desconocido.'}],
   intervenciones:['Leer en voz alta y preguntar “¿se entiende?”.','Ofrecer modelos de cartas.'],
   recursos:['Modelos de cartas.','Buzón del aula.']},
  card:{consigna:'Escriban o dibujen juntos una carta breve para alguien que quieran (un familiar, un amigo, alguien que vive lejos).',
   tiempo:'10 a 15 minutos',con:'Alguien que acompañe',materiales:'Papel y lápiz, o un mensaje de voz.',
   preguntas:['¿Para quién es?','¿Cómo empieza una carta? ¿Cómo termina?','¿Qué le querés contar?'],
   orientacion:'El niño puede dictar o dibujar. No corrijas la ortografía: lo importante es que tenga algo que decir y alguien a quien decírselo.',
   mas:'Si quieren seguir: manden la carta o entréguenla en persona.',aula:'Puede traer una copia para el buzón del aula.',
   adapt:['Si hay poco tiempo: escriban solo el saludo y una frase.','Si prefieren, pueden grabar un mensaje de voz.'],
   voz:'Llevate esta misión a casa: escribí o dibujá una carta para alguien.'}},

 peces:{ id:'peces', grade:2, area:'cn', eje:'Seres vivos', cont:['Animales del río: peces y aves'],
  title:'Los peces del Paraná', icon:'pez', blurb:'Una misión para conocer a los animales del río.', duration:'15 min', buddy:'guaca', scene:'rio',
  reward:{icon:'escama',name:'Escama de dorado'}, activity:'Peces y aves de la costa',
  kw:'peces aves río paraná animales clasificar características ciencias naturales ambiente acuático costa',
  stations:[
    {type:'clasificar',title:'Peces y aves',aim:'Clasificar animales según sean peces o aves e identificar rasgos.',
      intro:'En el río y en la costa viven peces y aves. ¡Ayudame a ordenarlos!',ok:'¡Muy bien! Los peces nadan con aletas y las aves tienen plumas.',hint:'Los peces tienen aletas. Las aves tienen plumas y alas.',
      bins:[{id:'pez',label:'Peces',em:'dorado'},{id:'ave',label:'Aves',em:'pluma'}],
      items:[{em:'dorado',n:'Dorado',b:'pez'},{em:'siriri',n:'Pato sirirí',b:'ave'},{em:'palometa',n:'Palometa',b:'pez'},{em:'garza',n:'Garza',b:'ave'},{em:'boga',n:'Boga',b:'pez'},{em:'hornero',n:'Hornero',b:'ave'}]},
    {type:'elegir',title:'¿Qué necesitan los peces?',aim:'Identificar una necesidad básica de los peces.',
      intro:'Los peces viven en el río. ¿Qué necesitan para respirar?',ok:'¡Exacto! Los peces respiran el aire que hay disuelto en el agua.',hint:'Pensá en lo que hay en el río.',
      media:'dorado',options:['Agua','Arena seca','Nubes'],answer:0}],
  sheet:{
   proposito:'Que los niños identifiquen características que permiten agrupar animales del río (peces y aves) y comprendan algunas relaciones entre las características y el ambiente.',
   situacion:'Los niños clasifican animales del río en peces y aves y responden una pregunta sobre lo que necesitan para vivir.',
   aprendizajes:['Clasificar animales según características observables.','Relacionar características con el ambiente.','Usar vocabulario específico (aletas, plumas, branquias).'],
   previos:['Nombrar animales del entorno.'],
   curriculo:{ref:'Ciencias Naturales · Seres vivos',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Agrupar por características (aletas, plumas).'],
   posibles:['Agrupar por “lo que hacen” o por “dónde están”.'],
   estrategias:['Observar imágenes y anotar semejanzas y diferencias.'],
   anticipaciones:['El pato puede generar dudas (vive en el agua pero es un ave).'],
   errores:[{e:'Agrupan por ambiente y no por características.',q:'Preguntar “¿qué tienen en el cuerpo? ¿cómo se mueven?”.'},{e:'Creen que todo lo que vive en el agua es pez.',q:'Mostrar aves y otros animales que viven cerca del agua.'}],
   variables:[{v:'Cantidad de grupos',d:'2 → 3 (peces, aves, reptiles).'},{v:'Criterio dado o libre',d:'Con criterio anticipado o los niños lo proponen.'}],
   intervenciones:['“¿En qué se parecen estos dos?”','Pedir que expliquen su criterio.'],
   recursos:['Láminas de animales del Paraná.','Guía de observación en la costa.']},
  card:{consigna:'Miren juntos fotos, láminas o el río si tienen cerca: ¿qué animales ven? ¿En qué se parecen y en qué se diferencian?',
   tiempo:'10 a 15 minutos',con:'Alguien que acompañe',materiales:'Fotos, libros o un paseo cerca del agua.',
   preguntas:['¿Qué animales ven?','¿En qué se parecen?','¿Cómo se mueven? ¿Qué comen?'],
   orientacion:'Está bien no saber. Podés decir “no sé, busquemos juntos” y mirar en un libro o preguntar a alguien que conozca del río.',
   mas:'Si quieren seguir: dibujen un pez y un ave y marquen qué cosas tienen en común.',aula:'Puede contar qué animal le llamó la atención.',
   adapt:['Si no tienen cerca un río: usen fotos o dibujos.','Pueden preguntar a un pescador o a un vecino que conozca del río.'],
   voz:'Llevate esta misión a casa: observá animales del río y contá en qué se parecen.'}},

 feria:{ id:'feria', grade:2, area:'mat', eje:'Número y operaciones', cont:['Sistema monetario: precios y pagos','La feria y los oficios de la costa'],
  title:'La feria de la costanera', icon:'feria', blurb:'Una misión para comprar y vender en la feria.', duration:'15 min', buddy:'guaca', scene:'rio',
  reward:{icon:'acordeon',name:'Acordeón de chamamé'}, activity:'Precios y pagos',
  kw:'precios dinero monedas billetes comprar vender feria sistema monetario pagar cambio cálculo oficios',
  stations:[
    {type:'unir',title:'Uní cada producto con su precio',aim:'Relacionar productos con precios y compararlos.',
      intro:'En la feria hay muchas cosas ricas. Uní cada producto con su precio.',ok:'¡Todo con su precio! Ahora podemos comprar.',hint:'Mirá bien los números y pensá cuál es más grande.',
      pairs:[{a:'miel',b:'$20'},{a:'chipa',b:'$10'},{a:'naranja',b:'$5'}]},
    {type:'elegir',title:'¿Alcanza con $20?',aim:'Resolver una situación de compra con dos precios.',
      intro:'Tenés $20. ¿Podés comprar dos chipás de $10?',ok:'¡Sí! Dos chipás de $10 son justo $20.',hint:'Sumá: $10 y otros $10.',
      media:'chipa',options:['Sí, alcanza justo','No, no alcanza','Sobra dinero'],answer:0}],
  sheet:{
   proposito:'Que los niños usen el dinero en situaciones de compra sencillas, resolviendo con cálculos y comparaciones de precios.',
   situacion:'Los niños relacionan productos con precios y resuelven una situación de compra en la feria.',
   aprendizajes:['Leer y comparar precios.','Resolver situaciones de compra con sumas simples.','Reconocer el uso social del dinero.'],
   previos:['Leer números hasta 20 o más.','Sumar cantidades pequeñas.'],
   curriculo:{ref:'Matemática · Número y operaciones · Ciencias Sociales · Trabajos y oficios',nota:'Referencia de demostración a completar con el equipo de contenidos.'},
   esperables:['Comparar precios.','Sumar con apoyo de dibujos o dedos.'],
   posibles:['Contar de 10 en 10.','Agrupar de 5 en 5.'],
   estrategias:['Usar billetes y monedas de juguete.'],
   anticipaciones:['Algunos niños van a preguntar por el vuelto: es una buena entrada al problema siguiente.'],
   errores:[{e:'Suman dígitos en lugar de valores.',q:'Volver a los billetes: “¿cuánto vale cada uno?”.'},{e:'Eligen el precio por el dibujo y no por el número.',q:'Preguntar “¿qué número dice acá?”.'}],
   variables:[{v:'Precios',d:'Múltiplos de 5 y de 10 → precios arbitrarios.'},{v:'Cantidad de productos',d:'2 → 3 o más.'}],
   intervenciones:['“¿Cuánto tenés? ¿Cuánto cuesta?”','Proponer jugar a la feria con billetes de juguete.'],
   recursos:['Billetes y monedas recortables.','Cartelitos de precios.']},
  card:{consigna:'Jueguen a la feria: pongan precios a algunas cosas de la casa con papelitos y usen tapitas o papelitos como dinero para comprar y vender.',
   tiempo:'15 minutos',con:'Alguien que acompañe (o varios chicos)',materiales:'Objetos de la casa, papelitos, tapitas o monedas de juguete.',
   preguntas:['¿Cuánto cuesta esto?','Si tengo esta cantidad, ¿qué puedo comprar?','¿Cómo sabemos si alcanza?'],
   orientacion:'Que el niño elija los precios y el modo de pagar. Podés preguntar “¿cómo hiciste la cuenta?” y escuchar sin corregir.',
   mas:'Si quieren seguir: cambien los precios y vean qué cambia en lo que pueden comprar.',aula:'Puede contar en la escuela a qué jugaron y cómo hicieron las cuentas.',
   adapt:['Si hay poco tiempo: jueguen con solo tres productos.','Si no hay tapitas: usen papelitos con números.'],
   voz:'Llevate esta misión a casa: jugá a la feria con alguien.'}}
};

/* ---------- Contenidos generales de ACOMPAÑAR (por grado) ---------- */
const GEN = {
 1:{theme:'Primeros pasos en el mundo digital',role:'Estar al lado',
   intro:'En esta etapa lo más importante no es el dispositivo, sino tener a alguien cerca. Acompañar es mirar juntos y conversar.',
   items:[
    {id:'g1a',title:'Mirar juntos la pantalla',min:2,sum:'Por qué en 1.º grado conviene estar al lado.',
     body:['A esta edad, lo que un niño hace en la pantalla vale mucho más cuando alguien lo mira con él. Sentarse cerca, preguntar y comentar convierte un rato de juego en una conversación.','No hace falta saber de tecnología: alcanza con interesarse por lo que el niño descubre.'],
     tips:['Preguntá “¿qué hiciste?” y “¿qué descubriste?”.','Dejá que sea el niño quien muestre cómo se hace.','Si hay un solo dispositivo en casa, pueden turnarse los hermanos.']},
    {id:'g1b',title:'Un ratito y a otra cosa',min:2,sum:'Acordar cuánto tiempo y cómo se termina.',
     body:['Es más fácil cuando el cierre es claro y siempre parecido: “se termina la aventura, apagamos y jugamos afuera”.','Los momentos de pantalla funcionan mejor cuando no sustituyen el juego, el sueño ni las comidas.'],
     tips:['Anticipá: “cuando termines esta aventura, seguimos con otra cosa”.','Elijan juntos un ritual de cierre.','Ofrecé una actividad concreta para después.']},
    {id:'g1c',title:'Lo que es de cada uno: nuestros datos',min:3,sum:'Qué no se comparte y por qué.',
     body:['Nombre completo, dirección, escuela y fotos son datos personales. En Educaplay Primaria los niños usan un apodo y un avatar.','Con los más chicos alcanza una regla sencilla: “eso lo hablamos siempre con un adulto antes de contárselo a alguien”.'],
     tips:['Practiquen inventar un apodo.','Pregunten antes de sacar o compartir fotos.','Cuando algo les da dudas, se cuenta.']}]},
 2:{theme:'Hábitos y cuidado',role:'Acordar reglas juntos',
   intro:'A esta edad los niños ya pueden participar en los acuerdos: cuánto, cuándo y dónde usar el dispositivo, y cómo cuidarlo.',
   items:[
    {id:'g2a',title:'Cuidar el dispositivo y cuidarnos',min:2,sum:'Manos limpias, distancia y lugares.',
     body:['Cuidar el dispositivo se parece a cuidar un juguete valioso: se guarda en su lugar y se trata con cuidado.','También es cuidarse: buena luz, distancia de la pantalla, postura y descansos para mover el cuerpo.'],
     tips:['Definan un lugar fijo para guardar el dispositivo.','Hagan pausas para mirar lejos y estirar el cuerpo.']},
    {id:'g2b',title:'Dormir bien: pantallas y descanso',min:2,sum:'Cómo cuidar el sueño.',
     body:['Dormir bien es parte de aprender bien. Conviene evitar las pantallas un rato antes de acostarse.','Un acuerdo compartido (“la pantalla se apaga antes de la cena”) suele funcionar mejor que una prohibición.'],
     tips:['Acuerden una hora de apagado.','Reemplacen la pantalla por un cuento o una charla.']},
    {id:'g2c',title:'Si algo nos incomoda, lo contamos',min:3,sum:'Construir confianza para hablar.',
     body:['A veces aparece algo que da miedo, vergüenza o confusión. Lo más protector es que el niño sepa que puede contarlo sin que lo reten.','Respondé con calma: agradecé que lo haya contado y busquen juntos qué hacer.'],
     tips:['Dejale claro que no se va a enojar.','Escuchá primero, preguntá después.']}]},
 3:{theme:'Comunicación y convivencia digital',role:'Conversar antes de que aparezcan los problemas',soonItems:['Mensajes y grupos: cómo hablamos','Cuando un juego se pone feo','Primeras conversaciones sobre inteligencia artificial en casa']},
 4:{theme:'Información, búsqueda y seguridad',role:'Guiar la búsqueda',soonItems:['¿Cómo sabemos si algo es cierto?','Buscar juntos en internet','Contraseñas y cuentas']},
 5:{theme:'Identidad digital, privacidad y redes',role:'Confiar y acordar',soonItems:['Qué cuenta de nosotros el mundo digital','Redes sociales: edades, reglas y acuerdos','Pensamiento crítico ante lo que vemos']},
 6:{theme:'Ciudadanía digital, inteligencia artificial y participación',role:'Acompañar la autonomía',soonItems:['Participar y opinar en el mundo digital','Inteligencia artificial: para qué sirve y cuándo desconfiar','Derechos y responsabilidades en línea']}
};
const ADULTS = ['Familias','Abuelas y abuelos','Tíos y tías','Hermanos y hermanas mayores','Tutores','Vecinos y vecinas','Docentes','Educadores comunitarios'];

/* =========================================================
   Educaplay Primaria — arquitectura Descubrir / Proyectar / Acompañar
   Agregados a partir de "Sitio Educaplay Primaria Sugerencias" y
   "Mapa de Verbos". No reemplaza los datos anteriores: los reorganiza
   y completa. Los verbos son la ETIQUETA (Mapa de Verbos); la ficha
   completa (qué hace / qué puede comprender / referencia curricular)
   es la capa docente en PROYECTAR. En ACOMPAÑAR se muestra solo el
   verbo y la explicación breve, sin la referencia curricular.
   ========================================================= */

/* ---------- Mapa de Verbos (vocabulario común del sitio) ---------- */
const VERB_FAMILIES = [
  {id:'explorar', name:'EXPLORAR', verbs:['observar','explorar','descubrir','experimentar']},
  {id:'pensar', name:'PENSAR', verbs:['comparar','relacionar','anticipar','clasificar','inferir','resolver','registrar','ubicarse']},
  {id:'crear', name:'CREAR', verbs:['imaginar','diseñar','construir','transformar','producir']},
  {id:'comunicar', name:'COMUNICAR', verbs:['contar','explicar','preguntar','argumentar','representar']},
  {id:'interactuar', name:'INTERACTUAR', verbs:['escuchar','compartir','acordar','colaborar','participar','cuidar']},
  {id:'usar', name:'USAR CONOCIMIENTOS', verbs:['contar','medir','localizar','identificar','reconocer','seleccionar']}
];
// Verbos nuevos propuestos (no están aún en el documento base; ver informe de arquitectura):
// REGISTRAR y UBICARSE se sumaron a PENSAR, CUIDAR se sumó a INTERACTUAR — marcados como propuesta.
const VERB_NEW = ['registrar','ubicarse','cuidar'];
const familyOfVerb = v => VERB_FAMILIES.find(f=>f.verbs.includes(v));

/* ---------- Aprendizajes en acción + Profundizar, por módulo ----------
   apr: 2 a 3 fichas por módulo (verbo, otro verbo posible, qué hace,
   qué puede comprender, referencia curricular). Solo "frutos" tiene
   las dos fichas desarrolladas siguiendo los ejemplos del Mapa de
   Verbos (cartas → frutos); el resto queda con una ficha de ejemplo,
   señalada para que el equipo docente la complete y sume la segunda. */
const APR_PROF = {
  frutos:{ apr:[
    {verbo:'CONTAR', otro:'', hace:'Cuenta los frutos que puso en la cesta para saber cuántos son y comprobar si coinciden con los puntos del dado.', comprende:'Que contar sirve para saber cuántos hay y que se puede volver a contar para comprobar un resultado.', curricular:'Matemática · Eje Número y Operaciones · Números naturales: uso de los números en contextos de la vida diaria (contar, ordenar, identificar) y organización de colecciones para facilitar su conteo. (falta verificar el grado)'},
    {verbo:'COMPARAR', otro:'DECIDIR', hace:'Compara la cantidad de frutos de dos cestas para decidir quién tiene más, quién tiene menos o si tienen la misma cantidad.', comprende:'Que las cantidades se pueden comparar para saber cuál es mayor, y que hay distintas formas de hacerlo: contar o hacer corresponder uno a uno.', curricular:'Matemática · Eje Número y Operaciones · Números naturales: comparación de colecciones utilizando distintas estrategias (correspondencia, estimación, conteo). (falta verificar el grado)'}
  ], prof:{
    desafios:['Repetir el juego pidiendo cantidades más grandes, o cambiando la cantidad de frutos que caen por tirada.'],
    conversar:['Volver a preguntar en la ronda: "¿cómo se dieron cuenta de quién tenía más?" y comparar las estrategias que usó cada uno.'],
    crear:['Armar entre todos un afiche con las distintas maneras que encontraron para comparar cantidades (contar, poner en fila, agrupar).']
  }},
  historia:{ apr:[
    {verbo:'CONTAR', otro:'', hace:'Ordena las escenas de una historia y la vuelve a contar con sus propias palabras, apoyándose en las imágenes.', comprende:'Que un relato tiene un orden (algo pasa primero, después y al final) y que ese orden ayuda a que se entienda.', curricular:'Lengua · Eje Lectura y Oralidad: escucha comprensiva y reconstrucción de la secuencia narrativa de un relato. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Proponer inventar un cuarto momento para la historia, antes o después de los que ya se ordenaron.'],
    conversar:['Preguntar "¿por qué pusiste esa escena primero?" y dejar que expliquen su criterio, aunque el orden final varíe entre chicos.'],
    crear:['Dramatizar la historia entre varios, repartiendo los momentos, o dibujarla en una tira de tres viñetas.']
  }},
  esteros:{ apr:[
    {verbo:'CLASIFICAR', otro:'', hace:'Agrupa animales del Iberá según vivan en el agua o en el monte, usando lo que observa de cada uno.', comprende:'Que los animales pueden agruparse por características que comparten y que eso ayuda a entender cómo viven.', curricular:'Ciencias Naturales · Eje Seres Vivos: diversidad animal y relación entre las características de los seres vivos y el ambiente en que viven. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Sumar un tercer grupo (por ejemplo, animales que viven en el aire) y volver a clasificar.'],
    conversar:['Retomar los casos dudosos, como el pato, y preguntar qué otras clasificaciones podrían usar.'],
    crear:['Armar una lámina de clase con animales de la zona, agrupados como decida el grupo.']
  }},
  lugar:{ apr:[
    {verbo:'IDENTIFICAR', otro:'', hace:'Reconoce palabras conocidas del entorno (carteles, envases) apoyándose en la letra inicial y en la imagen.', comprende:'Que los carteles y envases dicen algo, y que se pueden usar pistas (letras, longitud) para anticipar qué dicen.', curricular:'Lengua · Eje Lectura: lectura de palabras significativas del entorno apoyada en indicios cuantitativos y cualitativos. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Buscar en la escuela otros carteles que empiecen con la misma letra trabajada en el módulo.'],
    conversar:['Preguntar "¿cómo te diste cuenta?" frente a cada acierto, para que expliciten la pista que usaron.'],
    crear:['Armar el mapa de carteles del barrio o de la escuela con dibujos y las palabras correspondientes.']
  }},
  puerto:{ apr:[
    {verbo:'RESOLVER', otro:'', hace:'Calcula cuántos pasajeros deben subir a la lancha para completar una cantidad dada.', comprende:'Que un número se puede completar de distintas maneras y que conviene apoyarse en resultados ya conocidos (como el 10).', curricular:'Matemática · Eje Número y Operaciones · Cálculo mental: complementos de un número, con especial atención al 10. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Cambiar la capacidad de la lancha (15, 18, 20) y repetir el desafío de completar.'],
    conversar:['Pedir que cuenten en voz alta cómo pensaron el cálculo: ¿contaron, usaron los dedos, recordaron un resultado?'],
    crear:['Inventar, en parejas, otra "lancha" con su propia capacidad para que un compañero la complete.']
  }},
  carta:{ apr:[
    {verbo:'REPRESENTAR', otro:'', hace:'Ordena las partes de una carta (saludo, mensaje, despedida) y reflexiona sobre para qué sirve cada una.', comprende:'Que un mensaje escrito tiene un destinatario y una estructura, y que la firma indica quién lo envía.', curricular:'Lengua · Eje Escritura: producción de escrituras con propósito comunicativo y reconocimiento de su estructura. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Escribir una carta real dirigida a otro grado o a alguien de la comunidad escolar.'],
    conversar:['Leer en voz alta distintas cartas de la clase y conversar sobre qué partes tienen en común.'],
    crear:['Armar un buzón del aula para las cartas que se vayan escribiendo durante el año.']
  }},
  peces:{ apr:[
    {verbo:'RELACIONAR', otro:'', hace:'Relaciona características de los animales (aletas, plumas) con el ambiente donde viven.', comprende:'Que las características del cuerpo de un animal están relacionadas con cómo vive y se mueve.', curricular:'Ciencias Naturales · Eje Seres Vivos: relación entre estructura corporal, comportamiento y ambiente. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Ampliar la clasificación sumando un tercer grupo, como reptiles o insectos de la costa.'],
    conversar:['Retomar el caso del pato u otro animal dudoso y conversar sobre qué otras pistas ayudarían a decidir.'],
    crear:['Dibujar un animal del río inventado y explicar, con esas mismas pistas, dónde viviría.']
  }},
  feria:{ apr:[
    {verbo:'CONTAR', otro:'', hace:'Cuenta y compara precios para resolver si el dinero disponible alcanza para una compra.', comprende:'Que el dinero se puede contar y sumar para saber si alcanza, y que hay distintas formas de calcularlo.', curricular:'Matemática · Eje Número y Operaciones · Uso social del dinero: lectura de precios y resolución de situaciones de compra-venta. (a completar por el equipo docente)'}
  ], prof:{
    desafios:['Agregar un tercer producto y una compra con vuelto, para complejizar el cálculo.'],
    conversar:['Preguntar cómo hicieron la cuenta: ¿contaron de a uno, agruparon, usaron un resultado que ya sabían?'],
    crear:['Armar una feria del aula con precios inventados por los propios chicos y chicas.']
  }}
};
Object.entries(APR_PROF).forEach(([id,x])=>{ if(MODS[id]) Object.assign(MODS[id], x); });

/* ---------- Habitar lo digital (Acompañar) ----------
   Reorganiza el contenido general por los TRES ejes del documento base
   (no por grado): Aprender con autonomía · Disfrutar y cuidarse ·
   Compartir experiencias. El grado queda como referencia secundaria. */
const HABITAR = {
  autonomia:{ title:'Aprender con autonomía', sub:'Primeras experiencias de autonomía y resolución.',
    items:[
      {id:'ha1', title:'Un ratito y a otra cosa', grade:'1.º grado', min:2, sum:'Anticipar el cierre de una actividad y animarse a decidir cuándo pasar a otra cosa.',
       body:['Es más fácil cuando el cierre es claro y siempre parecido: “se termina la aventura, apagamos y jugamos afuera”.','Anticipar el final ayuda a que sea el propio niño quien empiece a manejar ese momento, en lugar de que sea siempre una decisión del adulto.'],
       tips:['Anticipá: “cuando termines esta aventura, seguimos con otra cosa”.','Elijan juntos un ritual de cierre.','De a poco, dejá que decida él o ella cuándo alcanza por hoy.']},
      {id:'ha2', title:'Lo que es de cada uno: nuestros datos', grade:'1.º grado', min:3, sum:'Qué no se comparte y por qué, como primer paso de autonomía responsable.',
       body:['Nombre completo, dirección, escuela y fotos son datos personales. En Educaplay Primaria los niños usan un apodo y un avatar.','Con los más chicos alcanza una regla sencilla: “eso lo hablamos siempre con un adulto antes de contárselo a alguien”. Es una autonomía que se construye con acompañamiento, no sin él.'],
       tips:['Practiquen inventar un apodo.','Pregunten antes de sacar o compartir fotos.','Cuando algo les da dudas, se cuenta.']}
    ]},
  disfrute:{ title:'Disfrutar y cuidarse', sub:'Bienestar, pausas, emociones y acuerdos.',
    items:[
      {id:'hd1', title:'Cuidar el dispositivo y cuidarnos', grade:'2.º grado', min:2, sum:'Manos limpias, distancia y lugares: cuidar la pantalla también es cuidarse.',
       body:['Cuidar el dispositivo se parece a cuidar un juguete valioso: se guarda en su lugar y se trata con cuidado.','También es cuidarse: buena luz, distancia de la pantalla, postura y descansos para mover el cuerpo.'],
       tips:['Definan un lugar fijo para guardar el dispositivo.','Hagan pausas para mirar lejos y estirar el cuerpo.']},
      {id:'hd2', title:'Dormir bien: pantallas y descanso', grade:'2.º grado', min:2, sum:'Cómo cuidar el sueño cuando hay pantallas en el día.',
       body:['Dormir bien es parte de aprender bien. Conviene evitar las pantallas un rato antes de acostarse.','Un acuerdo compartido (“la pantalla se apaga antes de la cena”) suele funcionar mejor que una prohibición.'],
       tips:['Acuerden una hora de apagado.','Reemplacen la pantalla por un cuento o una charla.']}
    ]},
  compartir:{ title:'Compartir experiencias', sub:'Conversaciones, juegos y momentos en común.',
    items:[
      {id:'hc1', title:'Mirar juntos la pantalla', grade:'1.º grado', min:2, sum:'Por qué conviene estar al lado y compartir lo que se descubre.',
       body:['A esta edad, lo que un niño hace en la pantalla vale mucho más cuando alguien lo mira con él. Sentarse cerca, preguntar y comentar convierte un rato de juego en una conversación.','No hace falta saber de tecnología: alcanza con interesarse por lo que el niño descubre.'],
       tips:['Preguntá “¿qué hiciste?” y “¿qué descubriste?”.','Dejá que sea el niño quien muestre cómo se hace.','Si hay un solo dispositivo en casa, pueden turnarse los hermanos.']},
      {id:'hc2', title:'Si algo nos incomoda, lo contamos', grade:'2.º grado', min:3, sum:'Construir la confianza para compartir lo que da dudas, miedo o vergüenza.',
       body:['A veces aparece algo que da miedo, vergüenza o confusión. Lo más protector es que el niño sepa que puede contarlo sin que lo reten.','Respondé con calma: agradecé que lo haya contado y busquen juntos qué hacer.'],
       tips:['Dejale claro que no se va a enojar.','Escuchá primero, preguntá después.']}
    ]}
};
const HABITAR_FRASE = 'Cada vivencia digital es una oportunidad para ganar autonomía, disfrutar con cuidado y compartir con otros lo que se aprende.';
function findHabitarItem(id){ for(const k of Object.keys(HABITAR)) { const f=HABITAR[k].items.find(i=>i.id===id); if(f) return {key:k,item:f}; } return null; }

/* ---------- Conocer Educaplay Primaria (Acompañar) ---------- texto base del documento, con una corrección de tipeo evidente ---------- */
const CONOCER = {
  bajada:'interesarse, escuchar y aventurarse con los niños y niñas.',
  parrafos:[
   'Cuando los chicos y las chicas llevan a casa algo de lo que descubrieron, jugaron o aprendieron en la escuela, se abre una oportunidad para seguir preguntando, conversando y compartiendo. No hace falta saber de tecnología ni tener todas las respuestas: muchas veces, acompañar empieza simplemente por interesarse, escuchar y aventurarse con ellos.',
   'Educaplay Primaria propone experiencias digitales interactivas que forman parte de lo que chicos y chicas aprenden en la escuela. En esta sección, las familias y los adultos que los acompañan podrán conocer estas propuestas y acercarse a los personajes, historias y mundos que forman parte de sus experiencias de aprendizaje.',
   'Conocer estos mundos permite compartir aquello que los entusiasma, los sorprende o los invita a hacerse nuevas preguntas. Estar cerca del aprendizaje no siempre significa saber de antemano qué hacer, a veces alcanza con mirar juntos, preguntar, escuchar y dejarse sorprender.',
   'En este recorrido también encontrarán ideas para estar cerca de los aprendizajes, conocer qué se pone en juego en cada experiencia e identificar algunas claves para habitar lo digital de manera cuidada, acompañada y significativa.',
   'Educaplay Primaria es una propuesta del Ministerio de Educación de Corrientes para enriquecer las experiencias educativas de chicos y chicas, en la escuela y junto a quienes acompañan su crecimiento.'
  ],
  mundosBajada:'Las experiencias de Educaplay transcurren en distintos mundos, con personajes, historias y escenarios que acompañan a chicos y chicas mientras exploran, juegan y aprenden. Conocelos y descubrí qué hay detrás de cada propuesta.'
};

/* ---------- Preguntas que nos hacemos (Acompañar) — FAQ con texto real del documento base ---------- */
const FAQ = {
  entender:{ label:'Para entender', items:[
    {q:'¿Qué es Educaplay Primaria?', to:'#/acompanar/conocer', toLabel:'Conocer Educaplay Primaria'},
    {q:'¿Qué encuentran chicos y chicas en este sitio?', to:'#/acompanar/conocer#mundos', toLabel:'Conocer los mundos'},
    {q:'¿Por qué hay juegos e historias dentro de una propuesta de aprendizaje?', to:'#/acompanar/conocer', toLabel:'Conocer Educaplay Primaria'},
    {q:'¿Qué aprenden chicos y chicas cuando juegan e interactúan en lo digital?', to:'#/acompanar/aprendizajes', toLabel:'Aprendizajes en acción'},
    {q:'¿Dónde puedo saber qué aprendizajes hay detrás de cada actividad?', to:'#/acompanar/aprendizajes', toLabel:'Aprendizajes en acción'}
  ]},
  resolver:{ label:'Para resolver', items:[
    {q:'¿Necesito conexión a internet?', a:'Educaplay Primaria necesita conexión a internet para funcionar. Alcanza con una conexión estable, y si se corta, la actividad se puede retomar cuando vuelva.'},
    {q:'¿Puedo usarlo desde el celular?', a:'Educaplay Primaria se puede usar desde computadora, tablet y celular. (Recomendación de uso: a confirmar por el equipo.)'},
    {q:'¿Cómo vuelvo a una actividad?', a:'Cada actividad se puede volver a abrir desde el mundo o el módulo correspondiente. (A confirmar si el avance se guarda o si la actividad empieza de nuevo.)'},
    {q:'¿Qué hago si no carga?', a:'Probá con estos pasos: revisá la conexión, volvé a cargar la página, cerrá y abrí el navegador o probá con otro dispositivo. Si sigue sin funcionar, escribinos contándonos qué dispositivo usás y qué actividad querías abrir. (Canal de contacto: a definir.)'},
    {q:'¿Se pueden repetir las actividades?', a:'Sí, y volver a jugar es parte de aprender: cada vez se puede probar otra estrategia, corregir un intento o simplemente disfrutar de nuevo. (A confirmar que el diseño lo permita en todos los módulos.)'},
    {q:'¿Dónde encuentro las propuestas apropiadas para cada grado?', a:'En Descubrir, las propuestas se organizan por grado, área y mundo. (A confirmar el criterio final para que se reconozca fácilmente el grado de cada actividad.)'}
  ]},
  guiar:{ label:'Para guiar', items:[
    {q:'¿Tengo que ayudar mientras chicos y chicas usan Educaplay?', to:'#/acompanar/habitar/autonomia', toLabel:'Habitar lo digital → Aprender con autonomía'},
    {q:'¿Qué puedo hacer si se frustran?', to:'#/acompanar/habitar/autonomia', toLabel:'Aprender con autonomía'},
    {q:'¿Cómo puedo ayudar a quien participa sin darle la respuesta?', to:'#/acompanar/habitar/autonomia', toLabel:'Aprender con autonomía'},
    {q:'¿Cómo puedo ayudar aunque no sepa de tecnología?', to:'#/acompanar/estar-cerca', toLabel:'Estar cerca'},
    {q:'¿Cuánto tiempo conviene que usen Educaplay?', to:'#/acompanar/habitar/disfrute', toLabel:'Disfrutar y cuidarse'}
  ]},
  seguir:{ label:'Para seguir', items:[
    {q:'¿Dónde encuentro ideas para seguir en casa lo que se jugó en Educaplay?', to:'#/acompanar/estar-cerca', toLabel:'Estar cerca'},
    {q:'¿Cómo puedo retomar y conversar sobre lo que se vivió en una actividad?', to:'#/acompanar/habitar/compartir', toLabel:'Compartir experiencias'},
    {q:'¿Puedo proponer mis propios juegos a partir de una actividad?', to:'#/acompanar/estar-cerca', toLabel:'Estar cerca'}
  ]}
};
'use strict';
