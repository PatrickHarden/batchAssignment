import * as t from 'io-ts';
import useBAApi from './use-ba-api';

export const GradeCodeShape = t.union([
  t.literal('pk'),
  t.literal('k'),
  t.literal('1'),
  t.literal('2'),
  t.literal('3'),
  t.literal('4'),
  t.literal('5'),
  t.literal('6'),
  t.literal('7'),
  t.literal('8'),
  t.literal('9'),
  t.literal('10'),
  t.literal('11'),
  t.literal('12'),
  t.literal('it'),
  t.literal('ps'),
  t.literal('tk'),
  t.literal('pg'),
  t.literal('ug'),
  t.literal('o')
]);

export type GradeCode = t.TypeOf<typeof GradeCodeShape>;

const GradeNameShape = t.union([
  t.literal('Pre-Kindergarten'),
  t.literal('Kindergarten'),
  t.literal('Grade 1'),
  t.literal('Grade 2'),
  t.literal('Grade 3'),
  t.literal('Grade 4'),
  t.literal('Grade 5'),
  t.literal('Grade 6'),
  t.literal('Grade 7'),
  t.literal('Grade 8'),
  t.literal('Grade 9'),
  t.literal('Grade 10'),
  t.literal('Grade 11'),
  t.literal('Grade 12'),
  t.literal('InfantToddler'),
  t.literal('Preschool'),
  t.literal('Transitional-Kindergarten'),
  t.literal('PostGraduate'),
  t.literal('Ungraded'),
  t.literal('Other')
]);

export type GradeName = t.TypeOf<typeof GradeNameShape>;

const GradeShape = t.strict({
  code: GradeCodeShape,
  name: GradeNameShape
});

export type AvailableGrade = t.TypeOf<typeof GradeShape>;

const OrganizationShape = t.strict({
  id: t.number,
  name: t.string,
  grades: t.array(GradeCodeShape)
});

export const OrgDataShape = t.strict({
  availableGrades: t.array(GradeShape),
  organizations: t.array(OrganizationShape)
});

export const OrgDataResponseShape = t.strict({
  results: t.array(OrgDataShape)
});

export type Org = t.TypeOf<typeof OrgDataShape>;
export type Organization = t.TypeOf<typeof OrganizationShape>;
export type OrgResponse = t.TypeOf<typeof OrgDataResponseShape>;

export interface SectionsApiRequestProps {
  adminId: string;
  orgId: string;
  schoolYear: string;
}

export const useOrgsApi = ({ adminId, orgId, schoolYear }: SectionsApiRequestProps): Org => {
  return useBAApi({
    path: `/api/v1/organizations/admin/${adminId}/org/${orgId}/assessmentType/srm`,
    shape: OrgDataShape,
    query: {
      schoolYear
    }
  });
};
