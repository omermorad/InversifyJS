import { expect } from 'chai';

import { postConstruct } from '../../annotation/post_construct';
import * as ERRORS_MSGS from '../../constants/error_msgs';
import * as METADATA_KEY from '../../constants/metadata_keys';
import { decorate } from '../../index';
import { Metadata } from '../../planning/metadata';

describe('@postConstruct', () => {
  it('Should generate metadata for the decorated method', () => {
    class Katana {
      private useMessage!: string;

      @postConstruct()
      public testMethod() {
        this.useMessage = 'Used Katana!';
      }

      public use() {
        return 'Used Katana!';
      }

      public debug() {
        return this.useMessage;
      }
    }

    const metadata: Metadata = Reflect.getMetadata(
      METADATA_KEY.POST_CONSTRUCT,
      Katana,
    ) as Metadata;

    expect(metadata.value).to.be.equal('testMethod');
  });

  it('Should throw when applied multiple times', () => {
    function setup() {
      class Katana {
        @postConstruct()
        public testMethod1() {
          /* ... */
        }

        @postConstruct()
        public testMethod2() {
          /* ... */
        }
      }
      Katana.toString();
    }
    expect(setup).to.throw(ERRORS_MSGS.MULTIPLE_POST_CONSTRUCT_METHODS);
  });

  it('Should be usable in VanillaJS applications', () => {
    const vanillaJsWarrior: () => void = function () {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    vanillaJsWarrior.prototype.testMethod = function () {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    decorate(postConstruct(), vanillaJsWarrior.prototype, 'testMethod');

    const metadata: Metadata = Reflect.getMetadata(
      METADATA_KEY.POST_CONSTRUCT,
      vanillaJsWarrior,
    ) as Metadata;

    expect(metadata.value).to.be.equal('testMethod');
  });
});
