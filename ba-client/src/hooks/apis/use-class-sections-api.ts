import * as t from 'io-ts';
import useBAApi from './use-ba-api';
import { StringCodec } from '../../utils/string-from-number';

const SectionShape = t.array(
  t.strict({
    id: t.number.pipe(StringCodec, 'StringFromNumber'),
    organizationId: t.number,
    primaryTeacherId: t.union([t.number, t.null]),
    name: t.string,
    lowGrade: t.number,
    highGrade: t.number,
    schoolYear: t.union([t.number, t.string]),
    hasStudents: t.boolean,
    period: t.union([t.number, t.null, t.string])
  })
);

export type Section = t.TypeOf<typeof SectionShape>;

const SectionsResponseShape = t.strict({
  results: t.array(SectionShape)
});

export type SectionsResponse = t.TypeOf<typeof SectionsResponseShape>;

export interface SectionsApiRequestProps {
  userId: string;
  orgId: string;
  schoolYear: string;
}

export const useSectionsApi = ({ userId, orgId, schoolYear }: SectionsApiRequestProps): Section => {
  return useBAApi({
    path: `/api/v1/demographics/sections/staff/${userId}/organization/${orgId}`,
    shape: SectionShape,
    query: {
      schoolYear
    }
  });
};
