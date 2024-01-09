import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Facile a comprendre',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Ce site explique les principaux logiciels utiliser par les DevOps. 
      </>
    ),
  },
  {
    title: 'Concentrez-vous sur ce qui compte',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus vous permet de vous concentrer sur vos documents et
        nous nous chargerons des tâches ménagères. Allez-y et déplacez vous dans
        la documentation.

      </>
    ),
  },
  {
    title: 'Propulsé par React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Étendez ou personnalisez la mise en page de votre
        site Web en réutilisant React. Docusaurus peut être étendu
        tout en réutilisant les mêmes en-tête et pied de page.

      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
